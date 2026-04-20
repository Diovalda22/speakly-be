import express from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { addComment, getCommentsByPost } from "./comment.controller.js";

const router = express.Router();

router.get("/:postId", authMiddleware, getCommentsByPost);
router.post("/:postId", authMiddleware, addComment);

export default router;
