import prisma from "../../config/prisma.js";
import { createNotification } from "../notification/notification.service.js";

/**
 * Toggle follow/unfollow
 */
export const toggleFollow = async (followerId, followingId) => {
  followerId = Number(followerId);
  followingId = Number(followingId);

  if (followerId === followingId) {
    throw new Error("Tidak bisa follow diri sendiri");
  }

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    return { followed: false };
  }

  await prisma.follow.create({
    data: { followerId, followingId },
  });

  // Ambil data aktor untuk pesan notif
  const actor = await prisma.user.findUnique({
    where: { id: followerId },
    select: { name: true, username: true },
  });

  // Buat notifikasi ke orang yang difollow
  await createNotification({
    userId: followingId,
    actorId: followerId,
    type: "follow",
    postId: null,
    message: `${actor.name} (@${actor.username}) mulai mengikutimu`,
  });

  return { followed: true };
};

/**
 * Cek status follow antara dua user
 */
export const getFollowStatus = async (followerId, followingId) => {
  followerId = Number(followerId);
  followingId = Number(followingId);

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });

  const followerCount = await prisma.follow.count({
    where: { followingId },
  });

  const followingCount = await prisma.follow.count({
    where: { followerId: followingId },
  });

  return {
    isFollowing: !!existing,
    followerCount,
    followingCount,
  };
};

/**
 * Ambil daftar followers dari user
 */
export const getFollowers = async (userId) => {
  userId = Number(userId);
  const follows = await prisma.follow.findMany({
    where: { followingId: userId },
    include: {
      follower: {
        select: { id: true, name: true, username: true, avatar: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return follows.map((f) => f.follower);
};

/**
 * Ambil daftar following dari user
 */
export const getFollowing = async (userId) => {
  userId = Number(userId);
  const follows = await prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      following: {
        select: { id: true, name: true, username: true, avatar: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return follows.map((f) => f.following);
};
