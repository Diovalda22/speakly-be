import prisma from "../../config/prisma.js";

export const searchTopics = async (query) => {
  const posts = await prisma.post.findMany({
    where: {
      content: {
        contains: query,
        mode: "insensitive",
      },
    },
    include: {
      user: {
        select: { id: true, name: true },
      },
      _count: {
        select: { comments: true, likes: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const topics = posts.map((post) => {
    const hashtags = post.content.match(/#\w+/g) || [];
    return {
      ...post,
      hashtags,
    };
  });

  return topics;
};

export const getTrendingTopics = async (days = 7, limit = 10) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const posts = await prisma.post.findMany({
    where: {
      createdAt: {
        gte: startDate,
      },
    },
    include: {
      user: {
        select: { id: true, name: true },
      },
      _count: {
        select: { comments: true, likes: true },
      },
    },
  });

  const hashtagMap = {};

  for (const post of posts) {
    const hashtags = post.content.match(/#\w+/g) || [];
    for (const tag of hashtags) {
      const normalized = tag.toLowerCase();
      if (!hashtagMap[normalized]) {
        hashtagMap[normalized] = {
          name: tag,
          count: 0,
          posts: [],
        };
      }
      hashtagMap[normalized].count += 1;
      hashtagMap[normalized].posts.push(post.id);
    }
  }

  const trending = Object.values(hashtagMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((topic, index) => ({
      rank: index + 1,
      name: topic.name,
      postCount: topic.count,
      totalPosts: topic.posts.length,
    }));

  return trending;
};
