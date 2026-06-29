import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { Role } from "../../../generated/prisma/index.js";
import { articleCheckout, apcCheckout, completeOrderHandler, orderReceipt } from "./checkout.controller.js";

const router = Router();

router.use(authenticate);

router.post("/article/:doi",             articleCheckout);
router.post("/apc/:submissionId",        apcCheckout);
// Admin-only: manual order completion (normal path is via payment webhook)
router.post("/orders/:id/complete",      requireRole(Role.ADMIN), completeOrderHandler);
router.get("/orders/:id",                orderReceipt);
router.get("/orders/:id/receipt",        orderReceipt);

export default router;
