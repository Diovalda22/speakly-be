import express from "express";
import { search, trending } from "./topic.controller.js";

const router = express.Router();

router.get("/search", search);
router.get("/trending", trending);

export default router;
