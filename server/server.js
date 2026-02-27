import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://ai-blog-generator-raul1avlvg-fiyazahmd002-5785s-projects.vercel.app"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});