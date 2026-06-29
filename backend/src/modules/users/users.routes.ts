import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
  getMe, updateMe, changePasswordHandler, uploadAvatarHandler,
  dashboard, mySubmissions, myOrders,
  myAlerts, addAlert, removeAlert, updateAlertHandler,
  myBookmarks, bookmark, unbookmark,
  mySubscription, subscribe, unsubscribe,
  getReviewers, mySavedArticles, saveArticleHandler, unsaveArticleHandler,
  myHistory, addToHistory,
} from "./users.controller.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { Role } from "../../../generated/prisma/index.js";
import { imageUpload } from "../../middleware/upload.middleware.js";

const router = Router();

// Reviewer pool — public to editors/admins (before authenticate so it can be scoped)
router.get("/reviewers", authenticate, requireRole(Role.EDITOR, Role.ADMIN), getReviewers);

router.use(authenticate);

// Profile
router.get("/me",                         getMe);
router.put("/me",                         updateMe);
router.put("/me/password",                changePasswordHandler);
router.put("/me/avatar",                  imageUpload.single("avatar"), uploadAvatarHandler);
router.get("/me/dashboard",               dashboard);

// Activity
router.get("/me/submissions",             mySubmissions);
router.get("/me/orders",                  myOrders);

// Alerts
router.get("/me/alerts",                  myAlerts);
router.post("/me/alerts",                 addAlert);
router.put("/me/alerts/:id",              updateAlertHandler);
router.delete("/me/alerts/:id",           removeAlert);

// Bookmarks
router.get("/me/bookmarks",               myBookmarks);
router.post("/me/bookmarks/:articleId",   bookmark);
router.delete("/me/bookmarks/:articleId", unbookmark);

// Saved articles
router.get("/me/saved-articles",              mySavedArticles);
router.post("/me/saved-articles/:articleId",  saveArticleHandler);
router.delete("/me/saved-articles/:articleId", unsaveArticleHandler);

// View history
router.get("/me/history",                     myHistory);
router.post("/me/history/:articleId",         addToHistory);

// Subscription
router.get("/me/subscription",            mySubscription);
router.post("/me/subscription",           subscribe);
router.delete("/me/subscription",         unsubscribe);

export default router;
