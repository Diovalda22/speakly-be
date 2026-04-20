import prisma from "../../config/prisma.js";
import { getIO } from "../../config/socket.js";

export const createComment = async (userId, postId, data) => {
  const comment = await prisma.comment.create({
    data: {
      content: data.content,
      userId: Number(userId),
      postId: Number(postId),
    },
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
  });

  try {
    const io = getIO();
    io.emit("newComment", comment);
  } catch (error) {
    console.error("Realtime emission failed:", error.message);
  }

  return comment;
};

export const getComments = async (postId) => {
  const comments = await prisma.comment.findMany({
    where: { postId: Number(postId) },
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return comments;
};
