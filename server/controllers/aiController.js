import { GoogleGenAI } from "@google/genai";

console.log("Testing Gemini call...");

export const generateBlog = async (req, res) => {
  try {
    const { topic, tone } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
    Write a detailed blog about "${topic}".
    Tone: ${tone || "professional"}.
    Use proper headings and markdown formatting.
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-1.5-flash-latest",
      contents: prompt,
    });

    res.status(200).json({
      success: true,
      content: response.text,
    });
  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ error: "AI generation failed" });
  }
};
