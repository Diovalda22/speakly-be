import prisma from "../../config/prisma.js";
import { getIO } from "../../config/socket.js";

/**
 * Buat notifikasi baru dan emit via Socket.io ke room privat penerima
 */
export const createNotification = async ({ userId, actorId, type, postId = null, message }) => {
  // Jangan buat notif kalau user melakukan aksi ke diri sendiri
  if (userId === actorId) return null;

  const notification = await prisma.notification.create({
    data: {
      userId,
      actorId,
      type,
      postId,
      message,
      isRead: false,
    },
    include: {
      actor: {
        select: { id: true, name: true, username: true, avatar: true },
      },
      post: {
        select: { id: true, content: true },
      },
    },
  });

  // Emit ke room privat penerima saja
  try {
    const io = getIO();
    io.to(`user:${userId}`).emit("newNotification", notification);
  } catch (err) {
    console.error("Socket notification emit failed:", err.message);
  }

  return notification;
};

/**
 * Ambil semua notifikasi milik user (terbaru duluan)
 */
export const getNotifications = async (userId) => {
  return prisma.notification.findMany({
    where: { userId },
    include: {
      actor: {
        select: { id: true, name: true, username: true, avatar: true },
      },
      post: {
        select: { id: true, content: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Jumlah notifikasi yang belum dibaca
 */
export const getUnreadCount = async (userId) => {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
};

/**
 * Tandai satu notifikasi sebagai sudah dibaca
 */
export const markAsRead = async (notifId, userId) => {
  return prisma.notification.updateMany({
    where: { id: notifId, userId },
    data: { isRead: true },
  });
};

/**
 * Tandai semua notifikasi user sebagai sudah dibaca
 */
export const markAllAsRead = async (userId) => {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
};

/**
 * Hapus satu notifikasi
 */
export const deleteNotification = async (notifId, userId) => {
  return prisma.notification.deleteMany({
    where: { id: notifId, userId },
  });
};
