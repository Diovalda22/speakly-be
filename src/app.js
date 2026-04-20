import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import postRoutes from "./modules/post/post.routes.js";
import likeRoutes from "./modules/like/like.routes.js";
import commentRoutes from "./modules/comment/comment.routes.js";
import topicRoutes from "./modules/topic/topic.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to REST API Speakly app ><");
});

app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/like", likeRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/topic", topicRoutes);

export default app;
