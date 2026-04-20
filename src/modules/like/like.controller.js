import { getLikeCount, toggleLike } from "./like.service.js";

export const toggle = async (req, res) => {
  try {
    const result = await toggleLike(req.user.id, Number(req.params.postId));

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const countLike = async (req, res) => {
  try {
    const count = await getLikeCount(Number(req.params.postId));
    res.json({
      success: true,
      data: count,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
