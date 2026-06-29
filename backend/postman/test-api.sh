#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Research Portal — Full API Test Script
# Usage: bash postman/test-api.sh
# The script auto-starts the server with rate limiting disabled.
# ─────────────────────────────────────────────────────────────

BASE="${BASE:-http://localhost:3001}"
PORT="${PORT:-3001}"
PASS=0; FAIL=0

# ── Auto-manage server ────────────────────────────────────────
GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'

echo -e "${YELLOW}── Starting server on port $PORT (rate limits disabled) ──${NC}"
pkill -f "tsx watch src/server.ts" 2>/dev/null
sleep 1
SKIP_RATE_LIMIT=true PORT=$PORT npm run dev > /tmp/research-portal-test.log 2>&1 &
SERVER_PID=$!

# Wait for server to be ready (up to 15s)
for i in {1..15}; do
  if curl -s "$BASE/health" | grep -q '"success":true'; then
    echo -e "${GREEN}✓${NC} Server ready\n"
    break
  fi
  sleep 1
  if [[ $i -eq 15 ]]; then
    echo -e "${RED}✗ Server did not start. Check /tmp/research-portal-test.log${NC}"
    exit 1
  fi
done

trap "kill $SERVER_PID 2>/dev/null" EXIT

# ── Helpers ──────────────────────────────────────────────────
check() {
  local name="$1" status="$2" expected="$3"
  if [[ "$status" == *"$expected"* ]]; then
    echo -e "${GREEN}✓${NC} $name ($status)"
    ((PASS++))
  else
    echo -e "${RED}✗${NC} $name — got: $status"
    ((FAIL++))
  fi
}

section() { echo -e "\n${YELLOW}── $1 ──${NC}"; }

# ── 1. Health ────────────────────────────────────────────────
section "1. Health"
S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/health")
check "Health check" "$S" "200"

# ── 2. Auth ──────────────────────────────────────────────────
section "2. Auth"

# Register (may return 409 if already exists — both are fine)
S=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"TestPass123!","name":"Test User"}')
if [[ "$S" == "201" || "$S" == "409" ]]; then echo -e "${GREEN}✓${NC} Register (201 or 409) ($S)"; ((PASS++)); else echo -e "${RED}✗${NC} Register — got: $S"; ((FAIL++)); fi

# Login — capture token
RESP=$(curl -s -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"TestPass123!"}')
TOKEN=$(echo "$RESP" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
REFRESH=$(echo "$RESP" | grep -o '"refreshToken":"[^"]*' | cut -d'"' -f4)
S=$(echo "$RESP" | grep -o '"success":true' | head -1)
check "Login" "${S:-fail}" "success"

if [[ -z "$TOKEN" ]]; then
  echo -e "${RED}No auth token — check email/password or server logs. Skipping auth-required tests.${NC}"
fi

# Admin login — uses seeded admin@lumex.io / Admin@123
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@lumex.io}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-Admin@123}"
RESP2=$(curl -s -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")
ADMIN_TOKEN=$(echo "$RESP2" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
AS=$(echo "$RESP2" | grep -o '"success":true' | head -1)
check "Admin login" "${AS:-fail}" "success"

# Author login — uses seeded author1@lumex.io / Author@123 (has AUTHOR role for submissions)
RESP3=$(curl -s -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"author1@lumex.io","password":"Author@123"}')
AUTHOR_TOKEN=$(echo "$RESP3" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
AS3=$(echo "$RESP3" | grep -o '"success":true' | head -1)
check "Author login" "${AS3:-fail}" "success"

# Get Me
S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/auth/me" \
  -H "Authorization: Bearer $TOKEN")
check "Get /me" "$S" "200"

# Refresh token
S=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH\"}")
check "Refresh token" "$S" "200"

# ── 3. Users ─────────────────────────────────────────────────
section "3. Users / Profile"

S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/users/me" \
  -H "Authorization: Bearer $TOKEN")
check "GET /users/me" "$S" "200"

S=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$BASE/api/users/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name","bio":"Researcher at XYZ University"}')
check "PUT /users/me" "$S" "200"

S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/users/me/dashboard" \
  -H "Authorization: Bearer $TOKEN")
check "GET /users/me/dashboard" "$S" "200"

S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/users/me/alerts" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
check "Admin GET /users/me/alerts" "$S" "200"

# ── 4. Guard tests ───────────────────────────────────────────
section "4. Auth Guard Tests"

S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/users/me")
check "No token → 401" "$S" "401"

S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/users/me" \
  -H "Authorization: Bearer invalid.token.here")
check "Invalid token → 401" "$S" "401"

# AUTHOR-only route hit by a READER user → 403
S=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/submissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}')
check "READER hits AUTHOR route → 403" "$S" "403"

# ── 5. Articles ──────────────────────────────────────────────
section "5. Articles (Public)"

S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/articles?page=1&pageSize=5")
check "GET /articles" "$S" "200"

S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/articles/top?rankBy=views&limit=5")
check "GET /articles/top?rankBy=views" "$S" "200"

S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/articles/top?rankBy=citations&discipline=Computer+Science")
check "GET /articles/top?rankBy=citations&discipline" "$S" "200"

section "5b. Articles (Admin CRUD)"

# Create article — capture both status and ID
ARTICLE_CREATE=$(curl -s -w "\n%{http_code}" -X POST "$BASE/api/articles" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"doi":"10.9999/test-api-001","title":"API Test Article","abstract":"Test abstract for automated testing.","keywords":["test","api"],"discipline":"Computer Science","accessType":"OPEN_ACCESS","isPublished":false}')
ARTICLE_STATUS=$(echo "$ARTICLE_CREATE" | tail -1)
RESP=$(echo "$ARTICLE_CREATE" | head -1)
ARTICLE_ID=$(echo "$RESP" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
check "Admin POST /articles" "$ARTICLE_STATUS" "20"

if [[ -n "$ARTICLE_ID" ]]; then
  S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/articles/admin/$ARTICLE_ID" \
    -H "Authorization: Bearer $ADMIN_TOKEN")
  check "Admin GET /articles/admin/:id" "$S" "200"

  S=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$BASE/api/articles/$ARTICLE_ID" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"title":"Updated API Test Article","isPublished":true}')
  check "Admin PUT /articles/:id" "$S" "200"

  # Citation formats
  for FMT in apa mla bibtex ris; do
    S=$(curl -s -o /dev/null -w "%{http_code}" \
      "$BASE/api/articles/10.9999%2Ftest-api-001/cite?format=$FMT")
    check "GET /articles/:doi/cite?format=$FMT" "$S" "200"
  done

  # Figures
  RESP=$(curl -s -X POST "$BASE/api/articles/$ARTICLE_ID/figures" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"caption":"Figure 1","url":"https://example.com/fig1.png","type":"IMAGE"}')
  FIG_ID=$(echo "$RESP" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
  check "Admin POST /articles/:id/figures" "$(echo $RESP | grep -o 'id')" "id"

  S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/articles/$ARTICLE_ID/figures")
  check "GET /articles/:id/figures" "$S" "200"

  if [[ -n "$FIG_ID" ]]; then
    S=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE \
      "$BASE/api/articles/$ARTICLE_ID/figures/$FIG_ID" \
      -H "Authorization: Bearer $ADMIN_TOKEN")
    check "Admin DELETE /articles/:id/figures/:figureId" "$S" "200"
  fi

  # Supplementary
  S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/articles/$ARTICLE_ID/supplementary")
  check "GET /articles/:id/supplementary" "$S" "200"

  # Delete article
  S=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE/api/articles/$ARTICLE_ID" \
    -H "Authorization: Bearer $ADMIN_TOKEN")
  check "Admin DELETE /articles/:id" "$S" "200"
fi

# ── 6. Admin list all articles ────────────────────────────────
S=$(curl -s -o /dev/null -w "%{http_code}" \
  "$BASE/api/articles/admin/all?page=1&pageSize=5" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
check "Admin GET /articles/admin/all" "$S" "200"

# ── 7. Journals ──────────────────────────────────────────────
section "7. Journals"

S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/journals")
check "GET /journals" "$S" "200"

RESP=$(curl -s -X POST "$BASE/api/journals" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Journal","slug":"test-journal-api","description":"API test journal","discipline":"Computer Science","issn":"9999-0001","isActive":true}')
JOURNAL_ID=$(echo "$RESP" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
check "Admin POST /journals" "$(echo $RESP | grep -o 'id')" "id"

if [[ -n "$JOURNAL_ID" ]]; then
  S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/journals/test-journal-api")
  check "GET /journals/:slug" "$S" "200"

  S=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$BASE/api/journals/$JOURNAL_ID" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"description":"Updated description"}')
  check "Admin PUT /journals/:id" "$S" "200"

  S=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE/api/journals/$JOURNAL_ID" \
    -H "Authorization: Bearer $ADMIN_TOKEN")
  check "Admin DELETE /journals/:id" "$S" "200"
fi

# ── 8. Collections ────────────────────────────────────────────
section "8. Collections"

S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/collections")
check "GET /collections" "$S" "200"

RESP=$(curl -s -X POST "$BASE/api/collections" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Collection","slug":"test-collection-api","description":"Test","isActive":true}')
COL_ID=$(echo "$RESP" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
check "Admin POST /collections" "$(echo $RESP | grep -o 'id')" "id"

if [[ -n "$COL_ID" ]]; then
  S=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE/api/collections/$COL_ID" \
    -H "Authorization: Bearer $ADMIN_TOKEN")
  check "Admin DELETE /collections/:id" "$S" "200"
fi

# ── 9. Books ─────────────────────────────────────────────────
section "9. Books & Chapters"

S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/books?page=1&pageSize=5")
check "GET /books" "$S" "200"

S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/books/admin/all" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
check "Admin GET /books/admin/all" "$S" "200"

RESP=$(curl -s -X POST "$BASE/api/books" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Book","isbn":"978-0-000-00000-0","description":"Test book","publisher":"Test Press","publishedYear":2024,"isActive":true}')
BOOK_ID=$(echo "$RESP" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
check "Admin POST /books" "$(echo $RESP | grep -o 'id')" "id"

if [[ -n "$BOOK_ID" ]]; then
  RESP=$(curl -s -X POST "$BASE/api/books/$BOOK_ID/chapters" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"title":"Chapter 1","chapterNumber":1,"abstract":"Intro chapter","pageStart":1,"pageEnd":20}')
  CHAP_ID=$(echo "$RESP" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
  check "Admin POST /books/:id/chapters" "$(echo $RESP | grep -o 'id')" "id"

  if [[ -n "$CHAP_ID" ]]; then
    S=$(curl -s -o /dev/null -w "%{http_code}" \
      -X DELETE "$BASE/api/books/$BOOK_ID/chapters/$CHAP_ID" \
      -H "Authorization: Bearer $ADMIN_TOKEN")
    check "Admin DELETE /books/:id/chapters/:chapterId" "$S" "200"
  fi

  S=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE/api/books/$BOOK_ID" \
    -H "Authorization: Bearer $ADMIN_TOKEN")
  check "Admin DELETE /books/:id" "$S" "200"
fi

# ── 10. News ─────────────────────────────────────────────────
section "10. News"

S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/news?page=1&pageSize=5")
check "GET /news" "$S" "200"

RESP=$(curl -s -X POST "$BASE/api/news" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test News","slug":"test-news-api-001","content":"Test news content body.","excerpt":"Short excerpt.","isPublished":false}')
NEWS_ID=$(echo "$RESP" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
check "Admin POST /news" "$(echo $RESP | grep -o 'id')" "id"

if [[ -n "$NEWS_ID" ]]; then
  S=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE/api/news/$NEWS_ID" \
    -H "Authorization: Bearer $ADMIN_TOKEN")
  check "Admin DELETE /news/:id" "$S" "200"
fi

# ── 11. Careers ───────────────────────────────────────────────
section "11. Careers"

S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/careers")
check "GET /careers" "$S" "200"

# ── 12. Conferences ───────────────────────────────────────────
section "12. Conferences"

S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/conferences")
check "GET /conferences" "$S" "200"

RESP=$(curl -s -X POST "$BASE/api/conferences" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Conf 2025","slug":"test-conf-api-2025","description":"Test conference","location":"Remote","startDate":"2025-09-01T00:00:00.000Z","endDate":"2025-09-03T00:00:00.000Z"}')
CONF_ID=$(echo "$RESP" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
check "Admin POST /conferences" "$(echo $RESP | grep -o 'id')" "id"

if [[ -n "$CONF_ID" ]]; then
  S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/conferences/test-conf-api-2025")
  check "GET /conferences/:slug" "$S" "200"

  S=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE/api/conferences/$CONF_ID" \
    -H "Authorization: Bearer $ADMIN_TOKEN")
  check "Admin DELETE /conferences/:id" "$S" "200"
fi

# ── 13. Submissions ───────────────────────────────────────────
section "13. Submissions"

SUB_CREATE=$(curl -s -w "\n%{http_code}" -X POST "$BASE/api/submissions" \
  -H "Authorization: Bearer $AUTHOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Submission Paper","abstract":"This is the abstract for the test submission paper with sufficient detail about the research methodology and expected results.","keywords":["test","api"],"journalSlug":"journal-of-computer-science"}')
SUB_STATUS=$(echo "$SUB_CREATE" | tail -1)
SUB_RESP=$(echo "$SUB_CREATE" | head -1)
SUB_ID=$(echo "$SUB_RESP" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
check "POST /submissions (author)" "$SUB_STATUS" "20"

S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/users/me/submissions" \
  -H "Authorization: Bearer $AUTHOR_TOKEN")
check "GET /users/me/submissions" "$S" "200"

S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/submissions?page=1" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
check "Admin GET /submissions" "$S" "200"

if [[ -n "$SUB_ID" ]]; then
  S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/submissions/$SUB_ID" \
    -H "Authorization: Bearer $AUTHOR_TOKEN")
  check "GET /submissions/:id" "$S" "200"
fi

# ── 14. Search ────────────────────────────────────────────────
section "14. Search"

S=$(curl -s -o /dev/null -w "%{http_code}" \
  "$BASE/api/search?q=research&page=1&pageSize=5")
check "GET /search?q=research" "$S" "200"

S=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/search" \
  -H "Content-Type: application/json" \
  -d '{"q":"machine learning","disciplines":["Computer Science"],"page":1,"pageSize":5}')
check "POST /search (with filters)" "$S" "200"

S=$(curl -s -o /dev/null -w "%{http_code}" \
  "$BASE/api/search?q=john+doe&authorSearch=true")
check "GET /search?authorSearch=true" "$S" "200"

# ── 15. Contact ───────────────────────────────────────────────
section "15. Contact"

CONTACT_EMAIL="testcontact_$(date +%s)@example.com"
RESP=$(curl -s -X POST "$BASE/api/contact" \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"Test\",\"lastName\":\"User\",\"email\":\"$CONTACT_EMAIL\",\"subject\":\"API Test\",\"message\":\"Testing the contact form via automated script.\"}")
TICKET=$(echo "$RESP" | grep -o '"ticketId":"[^"]*' | cut -d'"' -f4)
check "POST /contact" "$(echo $RESP | grep -o 'ticketId')" "ticketId"

S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/contact?page=1" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
check "Admin GET /contact" "$S" "200"

# ── 16. Homepage ──────────────────────────────────────────────
section "16. Homepage"

S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/homepage")
check "GET /homepage" "$S" "200"

S=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$BASE/api/homepage/sections/hero" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":{"headline":"Welcome to Lumex","subheadline":"Open Research Platform","ctaLabel":"Explore","ctaUrl":"/articles"}}')
check "Admin PUT /homepage/sections/:section" "$S" "200"

# ── 17. Site Config ───────────────────────────────────────────
section "17. Site Config"

S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/site-config")
check "GET /site-config" "$S" "200"

S=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$BASE/api/site-config/site_name" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"value":"Lumex Research Portal"}')
check "Admin PUT /site-config/:key" "$S" "200"

# ── 18. Feeds & SEO ───────────────────────────────────────────
section "18. Feeds & SEO"

S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/feeds/latest.xml")
check "GET /feeds/latest.xml" "$S" "200"

S=$(curl -s -o /dev/null -w "%{http_code}" \
  "$BASE/api/feeds/discipline/Computer%20Science")
check "GET /feeds/discipline/:name" "$S" "200"

S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/sitemap.xml")
check "GET /sitemap.xml" "$S" "200"

S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/robots.txt")
check "GET /robots.txt" "$S" "200"

# ── 19. Rate Limiting ─────────────────────────────────────────
section "19. Rate Limit Check (contact endpoint)"
echo "   Sending 6 rapid requests to /api/contact (limit is 5/15min)..."
for i in {1..6}; do
  S=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/contact" \
    -H "Content-Type: application/json" \
    -d '{"firstName":"T","lastName":"T","email":"t@t.com","subject":"test","message":"rate limit test message"}')
  echo "   Request $i: $S"
done

# ── Summary ───────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════"
echo -e "  ${GREEN}PASSED: $PASS${NC}   ${RED}FAILED: $FAIL${NC}"
echo "═══════════════════════════════════"
