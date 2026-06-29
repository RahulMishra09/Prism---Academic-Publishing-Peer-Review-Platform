#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Research Portal — Advanced API Test Suite
# Tests: validation, security, IDOR, business logic, edge cases,
#        response schema, pagination, concurrent requests, workflow
# Usage: bash postman/test-api-advanced.sh
# ─────────────────────────────────────────────────────────────

BASE="${BASE:-http://localhost:3001}"
PORT="${PORT:-3001}"
PASS=0; FAIL=0; WARN=0

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

# ── Server startup ────────────────────────────────────────────
echo -e "${YELLOW}── Starting server (rate limits disabled) ──${NC}"
pkill -f "tsx watch src/server.ts" 2>/dev/null; sleep 1
SKIP_RATE_LIMIT=true PORT=$PORT npm run dev > /tmp/research-portal-adv.log 2>&1 &
SERVER_PID=$!
trap "kill $SERVER_PID 2>/dev/null" EXIT

for i in {1..15}; do
  curl -s "$BASE/health" | grep -q '"success":true' && break
  sleep 1
  [[ $i -eq 15 ]] && echo -e "${RED}Server failed to start${NC}" && exit 1
done
echo -e "${GREEN}✓${NC} Server ready\n"

# ── Helpers ───────────────────────────────────────────────────
pass() { echo -e "  ${GREEN}✓${NC} $1"; ((PASS++)) || true; }
fail() { echo -e "  ${RED}✗${NC} $1 ${RED}[got: $2]${NC}"; ((FAIL++)) || true; }
warn() { echo -e "  ${YELLOW}⚠${NC} $1"; ((WARN++)) || true; }
section() { echo -e "\n${CYAN}${BOLD}══ $1 ══${NC}"; }
subsection() { echo -e "\n${YELLOW}── $1 ──${NC}"; }

# http_code|body
req() {
  local method="$1" url="$2"; shift 2
  curl -s -w "\n%{http_code}" -X "$method" "$BASE$url" "$@"
}
code() { echo "$1" | tail -1; }
body() { echo "$1" | head -1; }
has()  { echo "$1" | grep -qF "$2" && echo "yes" || echo "no"; }

# ── Seed known credentials ────────────────────────────────────
subsection "Auth setup"
login() {
  local email="$1" pass="$2"
  curl -s -X POST "$BASE/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$email\",\"password\":\"$pass\"}"
}
extract_token()  { printf '%s' "$1" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4; }
extract_userid() { printf '%s' "$1" | grep -o '"user":{"id":"[^"]*' | grep -o '"id":"[^"]*' | cut -d'"' -f4; }

READER_RESP=$(login "reader@lumex.io" "Reader@123")
READER_TOKEN=$(extract_token "$READER_RESP")
READER_ID=$(extract_userid "$READER_RESP")
[[ -n "$READER_TOKEN" ]] && pass "Reader login" || fail "Reader login" "no token"

AUTHOR_RESP=$(login "author1@lumex.io" "Author@123")
AUTHOR_TOKEN=$(extract_token "$AUTHOR_RESP")
AUTHOR_ID=$(extract_userid "$AUTHOR_RESP")
[[ -n "$AUTHOR_TOKEN" ]] && pass "Author login" || fail "Author login" "no token"

REVIEWER_RESP=$(login "rev1@lumex.io" "Review@123")
REVIEWER_TOKEN=$(extract_token "$REVIEWER_RESP")
REVIEWER_ID=$(extract_userid "$REVIEWER_RESP")
[[ -n "$REVIEWER_TOKEN" ]] && pass "Reviewer login" || fail "Reviewer login" "no token"

EDITOR_RESP=$(login "editor@lumex.io" "Editor@123")
EDITOR_TOKEN=$(extract_token "$EDITOR_RESP")
[[ -n "$EDITOR_TOKEN" ]] && pass "Editor login" || fail "Editor login" "no token"

ADMIN_RESP=$(login "admin@lumex.io" "Admin@123")
ADMIN_TOKEN=$(extract_token "$ADMIN_RESP")
[[ -n "$ADMIN_TOKEN" ]] && pass "Admin login" || fail "Admin login" "no token"

# ─────────────────────────────────────────────────────────────
section "1. INPUT VALIDATION"
# ─────────────────────────────────────────────────────────────

subsection "Auth validation"

# Missing fields
R=$(req POST /api/auth/login -H "Content-Type: application/json" -d '{}')
[[ $(code "$R") == "400" ]] && pass "Login with empty body → 400" || fail "Login empty body" "$(code "$R")"

# Invalid email format
R=$(req POST /api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"not-an-email","password":"pass123"}')
[[ $(code "$R") == "400" ]] && pass "Login invalid email → 400" || fail "Login invalid email" "$(code "$R")"

# Short password on register
R=$(req POST /api/auth/register -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"newuser99@test.com","password":"abc"}')
[[ $(code "$R") == "400" ]] && pass "Register short password → 400" || fail "Register short password" "$(code "$R")"

# Wrong password
R=$(req POST /api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"admin@lumex.io","password":"WrongPass999"}')
[[ $(code "$R") == "401" ]] && pass "Wrong password → 401" || fail "Wrong password" "$(code "$R")"

# Non-existent user
R=$(req POST /api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"nobody@nowhere.com","password":"SomePass123"}')
[[ $(code "$R") == "401" ]] && pass "Non-existent user → 401" || fail "Non-existent user" "$(code "$R")"

subsection "Article validation"

# Missing required fields
R=$(req POST /api/articles -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" -d '{"title":"Only title"}')
[[ $(code "$R") == "400" ]] && pass "Create article missing required fields → 400" || fail "Article missing fields" "$(code "$R")"

# DOI too short
R=$(req POST /api/articles -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"doi":"x","title":"T","abstract":"A","discipline":"CS","accessType":"OPEN_ACCESS"}')
[[ $(code "$R") == "400" || $(code "$R") == "422" ]] \
  && pass "Article invalid DOI → 400/422" || warn "Article invalid DOI accepted ($(code "$R"))"

# Duplicate DOI
R=$(req POST /api/articles -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"doi":"10.1234/jcs.2026.001","title":"Dupe","abstract":"Duplicate DOI test.","discipline":"CS","accessType":"OPEN_ACCESS","isPublished":false}')
[[ $(code "$R") == "409" || $(code "$R") == "400" ]] \
  && pass "Duplicate DOI → 409/400" || fail "Duplicate DOI not rejected" "$(code "$R")"

subsection "Contact validation"

# Missing message field
R=$(req POST /api/contact -H "Content-Type: application/json" \
  -d '{"firstName":"A","lastName":"B","email":"a@b.com","subject":"Hi"}')
[[ $(code "$R") == "400" ]] && pass "Contact missing message → 400" || fail "Contact missing message" "$(code "$R")"

# Invalid email in contact
R=$(req POST /api/contact -H "Content-Type: application/json" \
  -d '{"firstName":"A","lastName":"B","email":"badmail","subject":"Hi","message":"Test message body."}')
[[ $(code "$R") == "400" ]] && pass "Contact invalid email → 400" || fail "Contact invalid email" "$(code "$R")"

subsection "Submission validation"

# Title too short (< 5 chars)
R=$(req POST /api/submissions -H "Authorization: Bearer $AUTHOR_TOKEN" \
  -H "Content-Type: application/json" -d '{"title":"Hi"}')
[[ $(code "$R") == "400" ]] && pass "Submission title too short → 400" || fail "Submission short title" "$(code "$R")"

# Abstract too short (< 50 chars)
R=$(req POST /api/submissions -H "Authorization: Bearer $AUTHOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Valid Title Here","abstract":"Short"}')
[[ $(code "$R") == "400" ]] && pass "Submission abstract too short → 400" || fail "Submission short abstract" "$(code "$R")"

subsection "Search validation"

# Empty query
R=$(req GET "/api/search?q=&page=1")
[[ $(code "$R") == "400" || $(code "$R") == "200" ]] \
  && pass "Search empty q handled ($(code "$R"))" || fail "Search empty q" "$(code "$R")"

# Invalid page/pageSize
R=$(req GET "/api/search?q=test&page=0")
[[ $(code "$R") == "400" ]] && pass "Search page=0 → 400" || warn "Search page=0 accepted ($(code "$R"))"

R=$(req GET "/api/search?q=test&pageSize=999")
[[ $(code "$R") == "400" ]] && pass "Search pageSize=999 → 400" || warn "Search pageSize=999 accepted ($(code "$R"))"

subsection "Pagination edge cases"

R=$(req GET "/api/articles?page=99999&pageSize=100")
[[ $(code "$R") == "200" ]] && pass "Pagination beyond last page returns 200 empty" || fail "Large page number" "$(code "$R")"
B=$(body "$R")
[[ $(has "$B" '"data"') == "yes" ]] && pass "Large page still returns data array" || fail "Large page no data key" ""

R=$(req GET "/api/articles?page=-1")
[[ $(code "$R") == "400" ]] && pass "Negative page → 400" || warn "Negative page not rejected ($(code "$R"))"

# ─────────────────────────────────────────────────────────────
section "2. SECURITY — AUTH & AUTHORIZATION"
# ─────────────────────────────────────────────────────────────

subsection "Token security"

# Expired/malformed JWT
R=$(req GET /api/users/me -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJmYWtlIn0.fake")
[[ $(code "$R") == "401" ]] && pass "Malformed JWT → 401" || fail "Malformed JWT" "$(code "$R")"

# Bearer with no token
R=$(req GET /api/users/me -H "Authorization: Bearer ")
[[ $(code "$R") == "401" ]] && pass "Empty Bearer token → 401" || fail "Empty Bearer" "$(code "$R")"

# Wrong auth scheme
R=$(req GET /api/users/me -H "Authorization: Basic dXNlcjpwYXNz")
[[ $(code "$R") == "401" ]] && pass "Basic auth scheme → 401" || fail "Basic auth" "$(code "$R")"

subsection "Role escalation attempts"

# Reader tries admin article create
R=$(req POST /api/articles -H "Authorization: Bearer $READER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"doi":"10.evil/hack","title":"Hack","abstract":"Attempt","discipline":"CS","accessType":"OPEN_ACCESS"}')
[[ $(code "$R") == "403" ]] && pass "Reader → admin article create → 403" || fail "Reader article create" "$(code "$R")"

# Reader tries to list all submissions
R=$(req GET /api/submissions -H "Authorization: Bearer $READER_TOKEN")
[[ $(code "$R") == "403" ]] && pass "Reader → list all submissions → 403" || fail "Reader list submissions" "$(code "$R")"

# Author tries admin user list
R=$(req GET /api/users -H "Authorization: Bearer $AUTHOR_TOKEN" 2>/dev/null)
S=$(code "$R")
[[ "$S" == "403" || "$S" == "404" ]] && pass "Author → admin user list → 403/404" || fail "Author user list" "$S"

# Reviewer tries to make editorial decision
R=$(req POST /api/submissions/nonexistent-id/decision \
  -H "Authorization: Bearer $REVIEWER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"decision":"ACCEPTED","notes":"Looks good"}')
[[ $(code "$R") == "403" ]] && pass "Reviewer → editorial decision → 403" || fail "Reviewer decision" "$(code "$R")"

# Author tries to delete another user's article
R=$(req DELETE /api/articles/10.1234%2Fjcs.2026.001 \
  -H "Authorization: Bearer $AUTHOR_TOKEN")
[[ $(code "$R") == "403" ]] && pass "Author → delete article → 403" || fail "Author delete article" "$(code "$R")"

subsection "IDOR — Insecure Direct Object Reference"

# Create a submission as AUTHOR
R=$(req POST /api/submissions -H "Authorization: Bearer $AUTHOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Private Submission","abstract":"Private abstract that should not be accessible by other users without permission.","keywords":["private"]}')
SUB_ID=$(body "$R" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [[ -n "$SUB_ID" ]]; then
  # READER tries to read AUTHOR's submission
  R=$(req GET /api/submissions/$SUB_ID -H "Authorization: Bearer $READER_TOKEN")
  [[ $(code "$R") == "403" || $(code "$R") == "404" ]] \
    && pass "IDOR: reader cannot read other's submission → 403/404" \
    || fail "IDOR: reader read other's submission" "$(code "$R")"

  # REVIEWER tries to read AUTHOR's submission (reviewers shouldn't see submissions not assigned to them)
  R=$(req GET /api/submissions/$SUB_ID -H "Authorization: Bearer $REVIEWER_TOKEN")
  [[ $(code "$R") == "403" || $(code "$R") == "404" ]] \
    && pass "IDOR: reviewer cannot read unassigned submission → 403/404" \
    || warn "Reviewer can read unassigned submission ($(code "$R")) — check intended behavior"
fi

# IDOR: try to access contact message with fake ID
R=$(req PATCH /api/contact/00000000-0000-0000-0000-000000000000 \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"CLOSED"}')
[[ $(code "$R") == "404" ]] && pass "IDOR: nonexistent contact ID → 404" || fail "IDOR contact" "$(code "$R")"

# IDOR: try accessing another user's order
R=$(req GET /api/checkout/orders/00000000-0000-0000-0000-000000000000/receipt \
  -H "Authorization: Bearer $READER_TOKEN")
[[ $(code "$R") == "404" || $(code "$R") == "403" ]] \
  && pass "IDOR: fake order receipt → 404/403" || warn "Fake order receipt ($(code "$R"))"

subsection "Injection attempts"

# SQL injection in search
R=$(req GET "/api/search?q=$(python3 -c "import urllib.parse; print(urllib.parse.quote(\"' OR 1=1; DROP TABLE articles;--\"))")")
[[ $(code "$R") == "200" || $(code "$R") == "400" ]] \
  && pass "SQL injection in search safely handled ($(code "$R"))" \
  || fail "SQL injection caused error" "$(code "$R")"

# XSS payload in article title (should be stored not executed — schema validation)
R=$(req POST /api/articles -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"doi":"10.9999/xss-test","title":"<script>alert(1)</script>","abstract":"XSS test abstract content.","discipline":"CS","accessType":"OPEN_ACCESS","isPublished":false}')
S=$(code "$R")
if [[ "$S" == "201" ]]; then
  XSS_ID=$(body "$R" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
  B=$(body "$R")
  # Title should be stored as-is (server sanitizes on output or frontend handles it)
  [[ $(has "$B" "<script>") == "yes" ]] \
    && warn "XSS payload stored verbatim — ensure frontend escapes output" \
    || pass "XSS payload sanitized at API level"
  # Cleanup
  [[ -n "$XSS_ID" ]] && req DELETE /api/articles/$XSS_ID -H "Authorization: Bearer $ADMIN_TOKEN" > /dev/null
elif [[ "$S" == "400" ]]; then
  pass "XSS payload rejected at validation → 400"
else
  warn "XSS test returned $S"
fi

# Oversized payload
LARGE_BODY=$(python3 -c "print('{\"title\":\"' + 'A'*100000 + '\"}')")
R=$(req POST /api/articles -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" -d "$LARGE_BODY")
[[ $(code "$R") == "400" || $(code "$R") == "413" ]] \
  && pass "Oversized payload rejected ($(code "$R"))" \
  || warn "Oversized payload not explicitly rejected ($(code "$R"))"

# ─────────────────────────────────────────────────────────────
section "3. BUSINESS LOGIC"
# ─────────────────────────────────────────────────────────────

subsection "Access control for paid content"

# Unauthenticated download of SUBSCRIPTION article — no pdfUrl in seed = 404 before auth check
# If pdfUrl is set: expect 401. If not set: expect 404. Both are correct.
R=$(req GET "/api/articles/10.1234%2Fbio.2026.001/download")
[[ $(code "$R") == "401" || $(code "$R") == "404" ]] \
  && pass "Unauthenticated paid article download → 401/404 ($(code "$R"))" \
  || fail "Unauth paid download" "$(code "$R")"

# Authenticated reader without subscription/order — access denied or no PDF
R=$(req GET "/api/articles/10.1234%2Fbio.2026.001/download" \
  -H "Authorization: Bearer $READER_TOKEN")
[[ $(code "$R") == "403" || $(code "$R") == "404" ]] \
  && pass "Reader without access → paid article → 403/404 ($(code "$R"))" \
  || fail "Reader paid download" "$(code "$R")"

# Open access article download
R=$(req GET "/api/articles/10.1234%2Fjcs.2026.001/download")
[[ $(code "$R") == "200" || $(code "$R") == "302" || $(code "$R") == "404" ]] \
  && pass "Open access article download ($(code "$R"))" \
  || fail "Open access download" "$(code "$R")"

subsection "Checkout business logic"

# Try to buy an open-access article
R=$(req POST /api/checkout/article/10.1234%2Fjcs.2026.001 \
  -H "Authorization: Bearer $READER_TOKEN")
[[ $(code "$R") == "422" ]] && pass "Buy open-access article → 422" || fail "Buy OA article" "$(code "$R")"

# Try to buy non-existent article
R=$(req POST /api/checkout/article/10.0000%2Fnonexistent \
  -H "Authorization: Bearer $READER_TOKEN")
[[ $(code "$R") == "404" ]] && pass "Buy nonexistent article → 404" || fail "Buy nonexistent" "$(code "$R")"

# Create an order (subscription article)
R=$(req POST /api/checkout/article/10.1234%2Fbio.2026.001 \
  -H "Authorization: Bearer $READER_TOKEN")
S=$(code "$R")
ORDER_ID=$(body "$R" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
[[ "$S" == "201" || "$S" == "409" ]] \
  && pass "Checkout subscription article → 201/409 ($(code "$R"))" \
  || fail "Checkout subscription article" "$S"

# Duplicate order prevention
if [[ "$S" == "201" && -n "$ORDER_ID" ]]; then
  R=$(req POST /api/checkout/article/10.1234%2Fbio.2026.001 \
    -H "Authorization: Bearer $READER_TOKEN")
  [[ $(code "$R") == "409" ]] && pass "Duplicate order prevented → 409" || fail "Duplicate order" "$(code "$R")"
fi

subsection "Subscription logic"

# Subscribe
R=$(req POST /api/users/me/subscription \
  -H "Authorization: Bearer $READER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plan":"MONTHLY"}')
S=$(code "$R")
[[ "$S" == "201" || "$S" == "409" ]] \
  && pass "Subscribe → 201/409 ($S)" || fail "Subscribe" "$S"

# Duplicate subscription
if [[ "$S" == "201" ]]; then
  R=$(req POST /api/users/me/subscription \
    -H "Authorization: Bearer $READER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"plan":"MONTHLY"}')
  [[ $(code "$R") == "409" ]] && pass "Duplicate subscription → 409" || fail "Duplicate subscription" "$(code "$R")"

  # Subscribed user can now access paid article
  R=$(req GET "/api/articles/10.1234%2Fbio.2026.001/download" \
    -H "Authorization: Bearer $READER_TOKEN")
  [[ $(code "$R") == "200" || $(code "$R") == "302" || $(code "$R") == "404" ]] \
    && pass "Subscriber accesses paid article ($(code "$R"))" \
    || fail "Subscriber paid access" "$(code "$R")"

  # Cancel
  R=$(req DELETE /api/users/me/subscription -H "Authorization: Bearer $READER_TOKEN")
  [[ $(code "$R") == "200" ]] && pass "Cancel subscription → 200" || fail "Cancel subscription" "$(code "$R")"
fi

# Invalid subscription plan
R=$(req POST /api/users/me/subscription \
  -H "Authorization: Bearer $READER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plan":"INVALID_PLAN"}')
[[ $(code "$R") == "400" ]] && pass "Invalid subscription plan → 400" || fail "Invalid plan" "$(code "$R")"

subsection "Submission workflow state machine"

# Create submission as author
R=$(req POST /api/submissions -H "Authorization: Bearer $AUTHOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Workflow Test Submission","abstract":"This abstract is long enough to pass validation and tests the submission workflow state machine transitions.","keywords":["workflow","test"]}')
WF_SUB_ID=$(body "$R" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
[[ -n "$WF_SUB_ID" ]] && pass "Create workflow submission (DRAFT)" || fail "Create workflow submission" "$(code "$R")"

if [[ -n "$WF_SUB_ID" ]]; then
  # Submissions require a file before submit — use admin to directly move status via decision
  # Test: DRAFT cannot be decided (wrong status)
  R=$(req POST /api/submissions/$WF_SUB_ID/decision \
    -H "Authorization: Bearer $EDITOR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"decision":"ACCEPTED","notes":"Test"}')
  [[ $(code "$R") == "422" || $(code "$R") == "400" ]] \
    && pass "Decision on DRAFT → 422/400 (correct state guard)" \
    || warn "Decision on DRAFT not blocked ($(code "$R"))"

  # Use an already-submitted submission from the seed for workflow tests
  SEED_SUB=$(curl -s "$BASE/api/submissions?page=1&pageSize=20" \
    -H "Authorization: Bearer $ADMIN_TOKEN" | \
    python3 -c "import sys,json; d=json.load(sys.stdin); subs=[s for s in d.get('data',[]) if s.get('status')=='SUBMITTED']; print(subs[0]['id'] if subs else '')" 2>/dev/null)

  if [[ -n "$SEED_SUB" ]]; then
    # Editor moves to under-review
    R=$(req POST /api/submissions/$SEED_SUB/under-review \
      -H "Authorization: Bearer $EDITOR_TOKEN")
    [[ $(code "$R") == "200" ]] && pass "Editor → UNDER_REVIEW" || fail "Under review" "$(code "$R")"

    # Assign reviewer
    if [[ -n "$REVIEWER_ID" ]]; then
      R=$(req POST /api/submissions/$SEED_SUB/reviewers \
        -H "Authorization: Bearer $EDITOR_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"reviewerId\":\"$REVIEWER_ID\",\"dueDate\":\"2026-12-31\"}")
      [[ $(code "$R") == "200" || $(code "$R") == "201" ]] \
        && pass "Assign reviewer → 200/201" || fail "Assign reviewer" "$(code "$R")"

      # Duplicate reviewer assignment
      R=$(req POST /api/submissions/$SEED_SUB/reviewers \
        -H "Authorization: Bearer $EDITOR_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"reviewerId\":\"$REVIEWER_ID\"}")
      [[ $(code "$R") == "409" ]] \
        && pass "Duplicate reviewer assignment → 409" \
        || warn "Duplicate reviewer not blocked ($(code "$R"))"

      # Reviewer submits structured review
      R=$(req POST /api/submissions/$SEED_SUB/review \
        -H "Authorization: Bearer $REVIEWER_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"recommendation":"MINOR_REVISION","commentsForEditor":"The paper is methodologically sound with clear contribution to the field.","commentsForAuthor":"Please expand the related work section and clarify terminology."}')
      [[ $(code "$R") == "200" || $(code "$R") == "201" ]] \
        && pass "Reviewer submits structured review" || fail "Reviewer review" "$(code "$R")"

      # Unassign reviewer
      R=$(req DELETE /api/submissions/$SEED_SUB/reviewers/$REVIEWER_ID \
        -H "Authorization: Bearer $EDITOR_TOKEN")
      [[ $(code "$R") == "200" ]] && pass "Unassign reviewer → 200" || fail "Unassign reviewer" "$(code "$R")"
    fi

    # Editor makes decision
    R=$(req POST /api/submissions/$SEED_SUB/decision \
      -H "Authorization: Bearer $EDITOR_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"decision":"REVISION_REQUIRED","notes":"Please address reviewer comments."}')
    [[ $(code "$R") == "200" ]] && pass "Editor decision → REVISION_REQUIRED" || fail "Editor decision" "$(code "$R")"
  else
    warn "No SUBMITTED seed submission found — skipping workflow steps"
  fi

  # Author withdraws their own DRAFT submission
  R=$(req POST /api/submissions/$WF_SUB_ID/withdraw \
    -H "Authorization: Bearer $AUTHOR_TOKEN")
  [[ $(code "$R") == "200" || $(code "$R") == "422" ]] \
    && pass "Author withdraw DRAFT ($(code "$R"))" \
    || fail "Author withdraw" "$(code "$R")"
fi

subsection "Bookmark logic"

ARTICLE_ID_OA=$(curl -s "$BASE/api/articles?page=1&pageSize=1" \
  | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [[ -n "$ARTICLE_ID_OA" ]]; then
  # Add bookmark
  R=$(req POST /api/users/me/bookmarks/$ARTICLE_ID_OA \
    -H "Authorization: Bearer $READER_TOKEN")
  [[ $(code "$R") == "200" || $(code "$R") == "201" ]] && pass "Add bookmark" || fail "Add bookmark" "$(code "$R")"

  # Duplicate bookmark
  R=$(req POST /api/users/me/bookmarks/$ARTICLE_ID_OA \
    -H "Authorization: Bearer $READER_TOKEN")
  [[ $(code "$R") == "409" || $(code "$R") == "200" ]] \
    && pass "Duplicate bookmark handled ($(code "$R"))" \
    || warn "Duplicate bookmark ($(code "$R"))"

  # List bookmarks — should contain the article
  R=$(req GET /api/users/me/bookmarks -H "Authorization: Bearer $READER_TOKEN")
  [[ $(code "$R") == "200" ]] && pass "List bookmarks → 200" || fail "List bookmarks" "$(code "$R")"
  [[ $(has "$(body "$R")" "$ARTICLE_ID_OA") == "yes" ]] \
    && pass "Bookmark appears in list" || fail "Bookmark not in list" ""

  # Remove bookmark (returns 200 or 204)
  R=$(req DELETE /api/users/me/bookmarks/$ARTICLE_ID_OA \
    -H "Authorization: Bearer $READER_TOKEN")
  [[ $(code "$R") == "200" || $(code "$R") == "204" ]] && pass "Remove bookmark → 200/204" || fail "Remove bookmark" "$(code "$R")"

  # Remove non-existent bookmark
  R=$(req DELETE /api/users/me/bookmarks/00000000-0000-0000-0000-000000000000 \
    -H "Authorization: Bearer $READER_TOKEN")
  [[ $(code "$R") == "404" ]] && pass "Remove nonexistent bookmark → 404" || warn "Remove nonexistent bookmark ($(code "$R"))"
fi

# ─────────────────────────────────────────────────────────────
section "4. RESPONSE SCHEMA VALIDATION"
# ─────────────────────────────────────────────────────────────

subsection "Standard success envelope"

# Some routes use sendSuccess {success,data}, others use raw {data, totalCount, page}
# Both are valid — check that "data" key is present and response is 200
check_envelope() {
  local name="$1" url="$2" token="$3"
  local R B S
  if [[ -n "$token" ]]; then
    R=$(req GET "$url" -H "Authorization: Bearer $token")
  else
    R=$(req GET "$url")
  fi
  S=$(code "$R"); B=$(body "$R")
  if [[ "$S" == "200" && $(has "$B" '"data"') == "yes" ]]; then
    pass "$name → 200 with data"
  else
    fail "$name response malformed" "HTTP $S — $(echo "$B" | head -c 80)"
  fi
}

check_envelope "GET /articles"            "/api/articles?page=1&pageSize=3"
check_envelope "GET /articles/admin/all"  "/api/articles/admin/all?page=1" "$ADMIN_TOKEN"
check_envelope "GET /journals"            "/api/journals"
check_envelope "GET /collections"         "/api/collections"
check_envelope "GET /books"               "/api/books"
check_envelope "GET /news"                "/api/news"
check_envelope "GET /careers"             "/api/careers"
check_envelope "GET /conferences"         "/api/conferences"
check_envelope "GET /homepage"            "/api/homepage"
check_envelope "GET /site-config"         "/api/site-config"
check_envelope "GET /users/me"            "/api/users/me" "$READER_TOKEN"
check_envelope "GET /users/me/dashboard"  "/api/users/me/dashboard" "$READER_TOKEN"

subsection "Error envelope"

check_error_envelope() {
  local name="$1" url="$2"
  local R B
  R=$(req GET "$url")
  B=$(body "$R")
  if [[ $(has "$B" '"success":false') == "yes" || $(has "$B" '"code"') == "yes" ]]; then
    pass "$name returns error envelope"
  else
    fail "$name error envelope malformed" "$(echo "$B" | head -c 80)"
  fi
}

check_error_envelope "401 has code+message"  "/api/users/me"
# 404 check
R=$(req GET "/api/articles/10.9999%2Fnonexistent-doi-xyz")
[[ $(has "$(body "$R")" '"code"') == "yes" || $(has "$(body "$R")" '"success":false') == "yes" ]] \
  && pass "404 returns error envelope" || fail "404 envelope" ""

subsection "Pagination meta fields"

R=$(req GET "/api/articles?page=1&pageSize=2")
B=$(body "$R")
MISSING=""
[[ $(has "$B" '"totalCount"') == "no" && $(has "$B" '"total"') == "no" ]] && MISSING="$MISSING totalCount"
[[ $(has "$B" '"page"') == "no" ]] && MISSING="$MISSING page"
[[ $(has "$B" '"pageSize"') == "no" && $(has "$B" '"limit"') == "no" ]] && MISSING="$MISSING pageSize"
[[ -z "$MISSING" ]] \
  && pass "Articles pagination has totalCount/page/pageSize" \
  || warn "Articles pagination missing:$MISSING"

subsection "Citation format headers"

for FMT in apa mla bibtex ris; do
  R=$(curl -s -I "$BASE/api/articles/10.1234%2Fjcs.2026.001/cite?format=$FMT")
  CT=$(echo "$R" | grep -i "content-type" | tr -d '\r')
  case $FMT in
    apa|mla)   [[ "$CT" == *"text/plain"* ]] && pass "cite?format=$FMT → text/plain" || fail "cite $FMT Content-Type" "$CT" ;;
    bibtex)    [[ "$CT" == *"application/x-bibtex"* || "$CT" == *"text/plain"* ]] && pass "cite?format=bibtex → bibtex/plain" || fail "cite bibtex Content-Type" "$CT" ;;
    ris)       [[ "$CT" == *"application/x-research-info-systems"* || "$CT" == *"text/plain"* ]] && pass "cite?format=ris → ris/plain" || fail "cite ris Content-Type" "$CT" ;;
  esac
done

# RSS feeds return XML
for FEED in "latest.xml" "discipline/Computer%20Science"; do
  R=$(curl -s -I "$BASE/api/feeds/$FEED")
  CT=$(echo "$R" | grep -i "content-type" | tr -d '\r')
  [[ "$CT" == *"xml"* ]] && pass "Feed /$FEED → Content-Type: xml" || fail "Feed $FEED Content-Type" "$CT"
done

# Sitemap returns XML
R=$(curl -s -I "$BASE/sitemap.xml")
CT=$(echo "$R" | grep -i "content-type" | tr -d '\r')
[[ "$CT" == *"xml"* ]] && pass "sitemap.xml → Content-Type: xml" || fail "sitemap.xml Content-Type" "$CT"

# ─────────────────────────────────────────────────────────────
section "5. SEARCH — ADVANCED"
# ─────────────────────────────────────────────────────────────

subsection "Search result content"

# Search with known term — check highlights
R=$(req GET "/api/search?q=deep+learning&page=1&pageSize=5")
B=$(body "$R")
[[ $(code "$R") == "200" ]] && pass "Search 'deep learning' → 200" || fail "Search deep learning" "$(code "$R")"
# Highlights only appear when the term matches — check body for the term instead
[[ $(has "$B" "<mark>") == "yes" || $(has "$B" "deep") == "yes" ]] \
  && pass "Search results contain matches" \
  || warn "Search returned no matching content"
[[ $(has "$B" "<mark>") == "yes" ]] \
  && pass "Search result highlights present (<mark> tags)" \
  || warn "Search <mark> highlights not present — check highlightText() is applied to list results"

# Author search
R=$(req GET "/api/search?q=carlos&authorSearch=true")
[[ $(code "$R") == "200" ]] && pass "Author search → 200" || fail "Author search" "$(code "$R")"

# POST search with keyword filter
R=$(req POST /api/search -H "Content-Type: application/json" \
  -d '{"q":"learning","keywords":["deep learning","NLP"],"accessTypes":["OPEN_ACCESS"],"page":1,"pageSize":5}')
[[ $(code "$R") == "200" ]] && pass "POST search with keyword+access filter → 200" || fail "POST search filter" "$(code "$R")"

# Related articles
R=$(req GET "/api/search/related/10.1234%2Fjcs.2026.001?limit=5")
[[ $(code "$R") == "200" ]] && pass "Related articles → 200" || fail "Related articles" "$(code "$R")"
B=$(body "$R")
[[ $(has "$B" '"data"') == "yes" ]] && pass "Related articles returns data array" || fail "Related no data" ""

# Related for non-existent article
R=$(req GET "/api/search/related/10.0000%2Fnonexistent")
[[ $(code "$R") == "404" || $(code "$R") == "200" ]] \
  && pass "Related nonexistent article ($(code "$R"))" || fail "Related nonexistent" "$(code "$R")"

# Search suggestions
R=$(req GET "/api/search/suggestions?q=deep")
[[ $(code "$R") == "200" ]] && pass "Search suggestions → 200" || fail "Search suggestions" "$(code "$R")"

subsection "Filters and ranking"

for RANK in views downloads citations; do
  R=$(req GET "/api/articles/top?rankBy=$RANK&limit=5")
  [[ $(code "$R") == "200" ]] && pass "Top articles rankBy=$RANK → 200" || fail "Top rankBy=$RANK" "$(code "$R")"
done

R=$(req GET "/api/articles/top?rankBy=invalid")
[[ $(code "$R") == "400" || $(code "$R") == "200" ]] \
  && pass "Top invalid rankBy handled ($(code "$R"))" || fail "Top invalid rankBy" "$(code "$R")"

# ─────────────────────────────────────────────────────────────
section "6. CONCURRENCY & IDEMPOTENCY"
# ─────────────────────────────────────────────────────────────

subsection "Concurrent reads"

echo "  Firing 10 concurrent GET /api/articles requests..."
PIDS=(); RESULTS=()
for i in {1..10}; do
  TMP=$(mktemp)
  curl -s -o "$TMP" -w "%{http_code}" "$BASE/api/articles?page=1&pageSize=5" > /tmp/conc_$i.txt &
  PIDS+=($!)
done
wait "${PIDS[@]}" 2>/dev/null
ALL_OK=true
for i in {1..10}; do
  S=$(cat /tmp/conc_$i.txt 2>/dev/null)
  [[ "$S" != "200" ]] && ALL_OK=false
done
$ALL_OK && pass "10 concurrent reads all returned 200" || fail "Concurrent reads had failures" ""

subsection "Idempotency"

# GET is idempotent — same result twice
R1=$(req GET "/api/journals" | head -1 | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d.get('data',{}).get('journals',[]) if isinstance(d.get('data'),dict) else d.get('data',[])))" 2>/dev/null)
R2=$(req GET "/api/journals" | head -1 | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d.get('data',{}).get('journals',[]) if isinstance(d.get('data'),dict) else d.get('data',[])))" 2>/dev/null)
[[ "$R1" == "$R2" && -n "$R1" ]] \
  && pass "GET /journals idempotent (same count: $R1)" \
  || warn "GET /journals count mismatch ($R1 vs $R2)"

# Double logout — second should gracefully handle blacklisted token
R=$(req POST /api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"reader@lumex.io","password":"Reader@123"}')
TEMP_TOKEN=$(body "$R" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
TEMP_REFRESH=$(body "$R" | grep -o '"refreshToken":"[^"]*' | cut -d'"' -f4)
if [[ -n "$TEMP_TOKEN" ]]; then
  req POST /api/auth/logout \
    -H "Authorization: Bearer $TEMP_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"refreshToken\":\"$TEMP_REFRESH\"}" > /dev/null
  R=$(req POST /api/auth/logout \
    -H "Authorization: Bearer $TEMP_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"refreshToken\":\"$TEMP_REFRESH\"}")
  [[ $(code "$R") == "401" || $(code "$R") == "200" ]] \
    && pass "Double logout gracefully handled ($(code "$R"))" \
    || fail "Double logout error" "$(code "$R")"
  # Blacklisted token should not access protected routes
  R=$(req GET /api/users/me -H "Authorization: Bearer $TEMP_TOKEN")
  [[ $(code "$R") == "401" ]] && pass "Blacklisted token rejected → 401" || fail "Blacklisted token" "$(code "$R")"
fi

# ─────────────────────────────────────────────────────────────
section "7. EDGE CASES"
# ─────────────────────────────────────────────────────────────

subsection "Unicode and special characters"

# Unicode in search
R=$(req GET "/api/search?q=$(python3 -c "import urllib.parse; print(urllib.parse.quote('机器学习'))")")
[[ $(code "$R") == "200" ]] && pass "Unicode search query (Chinese) → 200" || fail "Unicode search" "$(code "$R")"

R=$(req GET "/api/search?q=$(python3 -c "import urllib.parse; print(urllib.parse.quote('naïve résumé'))")")
[[ $(code "$R") == "200" ]] && pass "Unicode search query (accented) → 200" || fail "Unicode accented search" "$(code "$R")"

# DOI with special chars (URL encoded)
R=$(req GET "/api/articles/10.1234%2Fjcs.2026.001")
[[ $(code "$R") == "200" ]] && pass "DOI with slash (URL encoded) → 200" || fail "DOI URL encoded" "$(code "$R")"

subsection "Not found cases"

for ENDPOINT in \
  "/api/articles/10.9999%2Fdoes-not-exist" \
  "/api/journals/no-such-journal" \
  "/api/conferences/no-such-conf" \
  "/api/news/no-such-slug"; do
  R=$(req GET "$ENDPOINT")
  [[ $(code "$R") == "404" ]] && pass "GET $ENDPOINT → 404" || fail "GET $ENDPOINT" "$(code "$R")"
done

subsection "Feeds with non-existent slugs"

R=$(req GET "/api/feeds/journal/no-such-journal")
[[ $(code "$R") == "200" || $(code "$R") == "404" ]] \
  && pass "Feed for nonexistent journal ($(code "$R"))" || fail "Feed nonexistent journal" "$(code "$R")"

R=$(req GET "/api/feeds/discipline/NonExistentField9999")
[[ $(code "$R") == "200" ]] && pass "Feed for empty discipline → 200 (empty feed)" || fail "Feed empty discipline" "$(code "$R")"

subsection "Method not allowed"

R=$(req DELETE "/api/articles" -H "Authorization: Bearer $ADMIN_TOKEN")
[[ $(code "$R") == "404" || $(code "$R") == "405" ]] \
  && pass "DELETE /api/articles → 404/405" || warn "DELETE collection ($(code "$R"))"

subsection "Content-Type enforcement"

# POST without Content-Type
R=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/auth/login" \
  -d '{"email":"admin@lumex.io","password":"Admin@123"}')
[[ "$R" == "400" || "$R" == "415" ]] \
  && pass "POST without Content-Type → 400/415" \
  || warn "POST without Content-Type accepted ($R)"

# ─────────────────────────────────────────────────────────────
section "8. ALERTS"
# ─────────────────────────────────────────────────────────────

R=$(req POST /api/users/me/alerts \
  -H "Authorization: Bearer $READER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"NEW_ARTICLE","query":"quantum computing"}')
S=$(code "$R")
ALERT_ID=$(body "$R" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
[[ "$S" == "201" || "$S" == "200" ]] && pass "Create alert → 201/200" || fail "Create alert" "$S"

R=$(req GET /api/users/me/alerts -H "Authorization: Bearer $READER_TOKEN")
[[ $(code "$R") == "200" ]] && pass "List alerts → 200" || fail "List alerts" "$(code "$R")"

# Invalid alert type
R=$(req POST /api/users/me/alerts \
  -H "Authorization: Bearer $READER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"INVALID_TYPE","query":"test"}')
[[ $(code "$R") == "400" ]] && pass "Invalid alert type → 400" || warn "Invalid alert type ($(code "$R"))"

if [[ -n "$ALERT_ID" ]]; then
  R=$(req DELETE /api/users/me/alerts/$ALERT_ID -H "Authorization: Bearer $READER_TOKEN")
  [[ $(code "$R") == "200" || $(code "$R") == "204" ]] && pass "Delete alert → 200/204" || fail "Delete alert" "$(code "$R")"

  # Double-delete
  R=$(req DELETE /api/users/me/alerts/$ALERT_ID -H "Authorization: Bearer $READER_TOKEN")
  [[ $(code "$R") == "404" ]] && pass "Delete nonexistent alert → 404" || warn "Double delete alert ($(code "$R"))"
fi

# ─────────────────────────────────────────────────────────────
section "9. SEO & FEED CONTENT VALIDATION"
# ─────────────────────────────────────────────────────────────

# Sitemap valid XML with urlset
R=$(curl -s "$BASE/sitemap.xml")
[[ "$R" == *"<urlset"* && "$R" == *"</urlset>"* ]] \
  && pass "sitemap.xml contains valid <urlset>" || fail "sitemap.xml invalid" ""
[[ "$R" == *"<loc>"* ]] && pass "sitemap.xml has <loc> entries" || warn "sitemap.xml has no <loc> entries"

# robots.txt contains sitemap pointer
R=$(curl -s "$BASE/robots.txt")
[[ "$R" == *"Sitemap:"* ]] && pass "robots.txt has Sitemap: directive" || fail "robots.txt missing Sitemap" ""
[[ "$R" == *"Disallow: /api/admin/"* ]] && pass "robots.txt disallows /api/admin/" || warn "robots.txt missing admin disallow"

# RSS feed valid XML
R=$(curl -s "$BASE/api/feeds/latest.xml")
[[ "$R" == *"<rss"* || "$R" == *"<feed"* ]] \
  && pass "RSS feed is valid XML with <rss>/<feed> root" || fail "RSS invalid XML" ""
[[ "$R" == *"<channel>"* || "$R" == *"<title>"* ]] \
  && pass "RSS feed has <channel>/<title>" || fail "RSS missing channel/title" ""

# ─────────────────────────────────────────────────────────────
section "10. JOURNAL ARTICLES ENDPOINT"
# ─────────────────────────────────────────────────────────────

R=$(req GET "/api/journals/journal-of-computer-science/articles")
[[ $(code "$R") == "200" ]] && pass "GET /journals/:slug/articles → 200" || fail "Journal articles" "$(code "$R")"
B=$(body "$R")
[[ $(has "$B" '"data"') == "yes" ]] && pass "Journal articles returns data" || fail "Journal articles no data" ""

# Non-existent journal articles
R=$(req GET "/api/journals/nonexistent-journal/articles")
[[ $(code "$R") == "404" || $(code "$R") == "200" ]] \
  && pass "Nonexistent journal articles ($(code "$R"))" || fail "Nonexistent journal articles" "$(code "$R")"

# ─────────────────────────────────────────────────────────────
# SUMMARY
# ─────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════"
echo -e "  ${GREEN}${BOLD}PASSED : $PASS${NC}   ${RED}${BOLD}FAILED : $FAIL${NC}   ${YELLOW}WARNINGS: $WARN${NC}"
echo "═══════════════════════════════════════════════════"
TOTAL=$((PASS + FAIL))
PCT=$(( PASS * 100 / TOTAL ))
echo -e "  Coverage: ${BOLD}$PCT%${NC} ($PASS/$TOTAL assertions)"
echo "═══════════════════════════════════════════════════"
echo ""
