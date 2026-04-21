import prisma from "../../config/prisma.js";
import { getIO } from "../../config/socket.js";

export const getPost = async () => {
  const getPost = await prisma.post.findMany({
    include: {
      user: {
        select: { id: true, name: true, username: true, avatar: true },
      },
      _count: {
        select: { comments: true, likes: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return getPost;
};

export const getPostById = async (id) => {
  const getPost = await prisma.post.findUnique({
    where: { id },
    include: {
      user: true,
      comments: {
        include: { user: true },
      },
      likes: true,
    },
  });

  return getPost;
};

export const createPost = async (userId, data) => {
  const { content } = data;

  const newPost = await prisma.post.create({
    data: {
      content,
      userId,
    },
    include: {
      user: {
        select: { id: true, name: true, username: true, avatar: true },
      },
      _count: {
        select: { comments: true, likes: true },
      },
    },
  });

  try {
    const io = getIO();
    io.emit("newPost", newPost);
  } catch (error) {
    console.error("Realtime newPost emission failed:", error.message);
  }

  return newPost;
};

export const updatePost = async (userId, postId, data) => {
  const { content } = data;
  const getPostById = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!getPostById) throw new Error("Postingan tidak ditemukan!");
  if (getPostById.userId !== userId) throw new Error("Unauthorized");

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: { content },
  });

  return updatedPost;
};

export const deletePost = async (userId, postId) => {
  const getPostById = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!getPostById) throw new Error("Postingan tidak ditemukan!");
  if (getPostById.userId !== userId) throw new Error("Unauthorized");

  await prisma.post.delete({
    where: { id: postId },
  });

  return true;
};
