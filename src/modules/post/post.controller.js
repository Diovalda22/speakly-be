import {
  createPost,
  deletePost,
  getPost,
  getPostById,
  updatePost,
} from "./post.service.js";

export const getAll = async (req, res) => {
  try {
    const post = await getPost();
    res.json({
      success: true,
      data: post,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const getDetail = async (req, res) => {
  try {
    const post = await getPostById(Number(req.params.id));
    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      message: err.message,
    });
  }
};

export const create = async (req, res) => {
  try {
    const post = await createPost(req.user.id, req.body);
    res.json({
      success: true,
      data: post,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const post = await updatePost(req.user.id, Number(req.params.id), req.body);
    res.json({
      success: true,
      data: post,
      message: "Postingan berhasil di edit",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = Number(req.params.id)
    await deletePost(userId, postId);

    res.json({
      success: true,
      message: "Post deleted",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
