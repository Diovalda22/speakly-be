import express from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { countLike, toggle } from "./like.controller.js";

const router = express.Router();
router.get("/:postId", authMiddleware, countLike);
router.post("/:postId", authMiddleware, toggle);

export default router;
