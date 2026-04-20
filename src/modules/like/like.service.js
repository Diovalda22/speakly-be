import prisma from "../../config/prisma.js";
import { getIO } from "../../config/socket.js";

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
    // 🔥 Emit realtime
    io.emit("likeUpdated", {
      postId,
      liked,
      userId,
      likeCount,
    });
  } catch (error) {
    console.error("Realtime emission failed:", error.message);
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
