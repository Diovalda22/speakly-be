import prisma from "../config/prisma.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    // cek blacklist
    const blacklisted = await prisma.blacklistToken.findUnique({
      where: { token },
    });

    if (blacklisted) {
      return res.status(401).json({
        message: "Token already logged out",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};
