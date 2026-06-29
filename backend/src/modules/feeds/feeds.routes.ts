import { Router } from "express";
import { journalFeed, disciplineFeed, latestFeed } from "./feeds.controller.js";

const router = Router();

router.get("/latest.xml",          latestFeed);
router.get("/journal/:slug",       journalFeed);   // also matches :slug.xml
router.get("/discipline/:name",    disciplineFeed); // also matches :name.xml

export default router;
