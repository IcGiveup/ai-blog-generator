import express from "express";
import { generateBlog } from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate", generateBlog);

export default router;