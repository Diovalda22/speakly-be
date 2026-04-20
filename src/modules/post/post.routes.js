import express from "express";
import {
  create,
  getAll,
  getDetail,
  update,
  remove,
} from "./post.controller.js";
import { authMiddleware } from "../../middleware/auth.js";

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getDetail);
router.post("/", authMiddleware, create);
router.put("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, remove);

export default router;
