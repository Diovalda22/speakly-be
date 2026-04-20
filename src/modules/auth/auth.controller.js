import { registerUser, loginUser, logoutUser } from "./auth.service.js";

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
