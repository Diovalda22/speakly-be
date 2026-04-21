import express from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { countLike, toggle, getLikeStatusController } from "./like.controller.js";

const router = express.Router();
router.get("/:postId/status", authMiddleware, getLikeStatusController);
router.get("/:postId", authMiddleware, countLike);
router.post("/:postId", authMiddleware, toggle);

export default router;
