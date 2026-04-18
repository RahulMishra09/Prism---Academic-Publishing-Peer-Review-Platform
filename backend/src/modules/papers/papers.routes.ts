import { Router } from "express";
import { Role } from "../../../generated/prisma/index.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import {
  create,
  getMine,
  list,
  getOne,
  update,
  submit,
  approve,
  reject,
} from "./papers.controller.js";

const router = Router();

// All papers routes require a valid JWT
router.use(authenticate);

//  Author routes 

// POST   /papers            create a new draft paper
router.post(
  "/",
  requireRole(Role.AUTHOR),
  create
);

// GET    /papers/my         list the author's own papers
// NOTE: must be registered BEFORE /:id to avoid "my" being treated as an id
router.get(
  "/my",
  requireRole(Role.AUTHOR),
  getMine
);

// PATCH  /papers/:id    update a draft paper
router.patch(
  "/:id",
  requireRole(Role.AUTHOR),
  update
);

// POST   /papers/:id/submit submit a draft paper for review
router.post(
  "/:id/submit",
  requireRole(Role.AUTHOR),
  submit
);

//  Editor routes 

// POST   /papers/:id/approve approve a submitted paper
router.post(
  "/:id/approve",
  requireRole(Role.EDITOR, Role.ADMIN),
  approve
);

// POST   /papers/:id/reject  reject a submitted paper
router.post(
  "/:id/reject",
  requireRole(Role.EDITOR, Role.ADMIN),
  reject
);

//  Shared read routes 

// GET    /papers            paginated list (visibility enforced per role)
router.get("/", list);

// GET    /papers/:id        full paper detail (visibility enforced per role)
router.get("/:id", getOne);

export default router;
