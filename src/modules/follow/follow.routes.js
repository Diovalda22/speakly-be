import express from "express";
import { authMiddleware } from "../../middleware/auth.js";
import {
  toggleFollowController,
  getFollowStatusController,
  getFollowersController,
  getFollowingController,
} from "./follow.controller.js";

const router = express.Router();

// POST /api/follow/:userId       → toggle follow/unfollow
router.post("/:userId", authMiddleware, toggleFollowController);

// GET /api/follow/:userId/status → cek apakah sudah following
router.get("/:userId/status", authMiddleware, getFollowStatusController);

// GET /api/follow/:userId/followers → daftar followers
router.get("/:userId/followers", authMiddleware, getFollowersController);

// GET /api/follow/:userId/following → daftar following
router.get("/:userId/following", authMiddleware, getFollowingController);

export default router;
