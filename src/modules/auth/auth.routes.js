import express from "express";
import { register, login, logout, searchUsersController, getUserProfileController } from "./auth.controller.js";
import { authMiddleware } from "../../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

// Cari user (opsional auth — jika ada token, exclude diri sendiri)
router.get("/search", authMiddleware, searchUsersController);

// Profil user by ID (opsional auth — jika ada token, cek isFollowing)
router.get("/user/:id", authMiddleware, getUserProfileController);

export default router;
