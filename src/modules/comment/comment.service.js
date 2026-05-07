import prisma from "../../config/prisma.js";
import { getIO } from "../../config/socket.js";
import { createNotification } from "../notification/notification.service.js";

export const createComment = async (userId, postId, data) => {
  const comment = await prisma.comment.create({
    data: {
      content: data.content,
      userId: Number(userId),
      postId: Number(postId),
    },
    include: {
      user: {
        select: { id: true, name: true, username: true, avatar: true },
      },
    },
  });

  try {
    const io = getIO();
    io.emit("newComment", comment);
  } catch (error) {
    console.error("Realtime emission failed:", error.message);
  }

  // 🔔 Trigger notifikasi ke pemilik post
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
      select: { userId: true },
    });

    if (post) {
      await createNotification({
        userId: post.userId,
        actorId: Number(userId),
        type: "comment",
        postId: Number(postId),
        message: `${comment.user.name} (@${comment.user.username}) mengomentari postinganmu`,
      });
    }
  } catch (err) {
    console.error("Failed to create comment notification:", err.message);
  }

  return comment;
};

export const getComments = async (postId) => {
  const comments = await prisma.comment.findMany({
    where: { postId: Number(postId) },
    include: {
      user: {
        select: { id: true, name: true, username: true, avatar: true },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return comments;
};
