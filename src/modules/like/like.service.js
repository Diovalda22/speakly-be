import prisma from "../../config/prisma.js";
import { getIO } from "../../config/socket.js";
import { createNotification } from "../notification/notification.service.js";

export const toggleLike = async (userId, postId) => {
  const existing = await prisma.like.findUnique({
    where: {
      userId_postId: { userId, postId },
    },
  });

  let liked;

  if (existing) {
    await prisma.like.delete({
      where: { id: existing.id },
    });
    liked = false;
  } else {
    await prisma.like.create({
      data: { userId, postId },
    });
    liked = true;
  }

  const likeCount = await prisma.like.count({
    where: { postId },
  });

  try {
    const io = getIO();
    // 🔥 Emit realtime like count update
    io.emit("likeUpdated", {
      postId,
      liked,
      userId,
      likeCount,
    });
  } catch (error) {
    console.error("Realtime emission failed:", error.message);
  }

  // 🔔 Trigger notifikasi ke pemilik post (hanya saat like, bukan unlike)
  if (liked) {
    try {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { userId: true },
      });

      if (post) {
        const actor = await prisma.user.findUnique({
          where: { id: userId },
          select: { name: true, username: true },
        });

        await createNotification({
          userId: post.userId,
          actorId: userId,
          type: "like",
          postId,
          message: `${actor.name} (@${actor.username}) menyukai postinganmu`,
        });
      }
    } catch (err) {
      console.error("Failed to create like notification:", err.message);
    }
  }

  return { liked, likeCount };
};

export const getLikeCount = async (postId) => {
  const count = await prisma.like.count({
    where: {
      postId: Number(postId),
    },
  });

  return count;
};

export const getLikeStatus = async (userId, postId) => {
  const existing = await prisma.like.findUnique({
    where: {
      userId_postId: { userId: Number(userId), postId: Number(postId) },
    },
  });

  const count = await prisma.like.count({
    where: { postId: Number(postId) },
  });

  return { isLiked: !!existing, count };
};
