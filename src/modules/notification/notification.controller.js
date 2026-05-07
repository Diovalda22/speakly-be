import * as notifService from "./notification.service.js";

export const getNotificationsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await notifService.getNotifications(userId);
    res.json({ success: true, data: notifications });
  } catch (err) {
    console.error("Get notifications error:", err);
    res.status(500).json({ success: false, message: "Gagal mengambil notifikasi" });
  }
};

export const getUnreadCountController = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await notifService.getUnreadCount(userId);
    res.json({ success: true, data: { count } });
  } catch (err) {
    console.error("Get unread count error:", err);
    res.status(500).json({ success: false, message: "Gagal mengambil jumlah notifikasi" });
  }
};

export const markAsReadController = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifId = Number(req.params.id);
    await notifService.markAsRead(notifId, userId);
    res.json({ success: true, message: "Notifikasi ditandai sebagai dibaca" });
  } catch (err) {
    console.error("Mark as read error:", err);
    res.status(500).json({ success: false, message: "Gagal menandai notifikasi" });
  }
};

export const markAllAsReadController = async (req, res) => {
  try {
    const userId = req.user.id;
    await notifService.markAllAsRead(userId);
    res.json({ success: true, message: "Semua notifikasi ditandai sebagai dibaca" });
  } catch (err) {
    console.error("Mark all as read error:", err);
    res.status(500).json({ success: false, message: "Gagal menandai semua notifikasi" });
  }
};

export const deleteNotificationController = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifId = Number(req.params.id);
    await notifService.deleteNotification(notifId, userId);
    res.json({ success: true, message: "Notifikasi dihapus" });
  } catch (err) {
    console.error("Delete notification error:", err);
    res.status(500).json({ success: false, message: "Gagal menghapus notifikasi" });
  }
};
