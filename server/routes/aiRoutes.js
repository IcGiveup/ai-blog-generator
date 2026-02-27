import express from "express";
import { generateBlog } from "../controllers/aiController.js";
import aiRoutes from "./routes/aiRoutes.js";

app.use("/api/ai", aiRoutes);

const router = express.Router();

router.post("/generate", generateBlog);

export default router;