import prisma from "../../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (data) => {
  const { name, email, password } = data;
  const existUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return user;
};

export const loginUser = async (data) => {
  const { email, password } = data;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("User not found!");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid password!");

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return { user, token };
};

export const logoutUser = async (token) => {
  await prisma.blacklistToken.create({
    data: { token },
  });

  return true;
};
