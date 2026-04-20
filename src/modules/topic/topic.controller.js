import { searchTopics, getTrendingTopics } from "./topic.service.js";

export const search = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    const topics = await searchTopics(q.trim());
    res.json({
      success: true,
      data: topics,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const trending = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const limit = parseInt(req.query.limit) || 10;
    const topics = await getTrendingTopics(days, limit);
    res.json({
      success: true,
      data: topics,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
