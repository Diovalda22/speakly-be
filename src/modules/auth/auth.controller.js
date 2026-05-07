import { registerUser, loginUser, logoutUser, searchUsers, getUserProfile } from "./auth.service.js";

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    res.json({
      success: true,
      data: user,
      message: "Register success",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);

    res.json({
      success: true,
      data: result,
      message: "Login success",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

    await logoutUser(token);

    res.json({
      success: true,
      message: "Logout success",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const searchUsersController = async (req, res) => {
  try {
    const { q } = req.query;
    const currentUserId = req.user?.id || null;
    const users = await searchUsers(q || "", currentUserId);
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserProfileController = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const currentUserId = req.user?.id || null;
    const user = await getUserProfile(userId, currentUserId);
    if (!user) return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
