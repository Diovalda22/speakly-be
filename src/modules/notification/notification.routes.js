import express from "express";
import { authMiddleware } from "../../middleware/auth.js";
import {
  getNotificationsController,
  getUnreadCountController,
  markAsReadController,
  markAllAsReadController,
  deleteNotificationController,
} from "./notification.controller.js";

const router = express.Router();

// GET /api/notification           → ambil semua notif user
router.get("/", authMiddleware, getNotificationsController);

// GET /api/notification/unread-count → jumlah unread
router.get("/unread-count", authMiddleware, getUnreadCountController);

// PATCH /api/notification/read-all → tandai semua dibaca
router.patch("/read-all", authMiddleware, markAllAsReadController);

// PATCH /api/notification/:id/read → tandai 1 dibaca
router.patch("/:id/read", authMiddleware, markAsReadController);

// DELETE /api/notification/:id    → hapus notif
router.delete("/:id", authMiddleware, deleteNotificationController);

export default router;
