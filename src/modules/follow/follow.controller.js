import * as followService from "./follow.service.js";

export const toggleFollowController = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = Number(req.params.userId);
    const result = await followService.toggleFollow(followerId, followingId);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Toggle follow error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getFollowStatusController = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = Number(req.params.userId);
    const result = await followService.getFollowStatus(followerId, followingId);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Get follow status error:", err);
    res.status(500).json({ success: false, message: "Gagal mengambil status follow" });
  }
};

export const getFollowersController = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const followers = await followService.getFollowers(userId);
    res.json({ success: true, data: followers });
  } catch (err) {
    console.error("Get followers error:", err);
    res.status(500).json({ success: false, message: "Gagal mengambil followers" });
  }
};

export const getFollowingController = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const following = await followService.getFollowing(userId);
    res.json({ success: true, data: following });
  } catch (err) {
    console.error("Get following error:", err);
    res.status(500).json({ success: false, message: "Gagal mengambil following" });
  }
};
