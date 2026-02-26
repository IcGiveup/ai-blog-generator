import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateBlog = async (req, res) => {
  try {
    const { topic, tone } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
    Write a detailed blog about "${topic}".
    Tone: ${tone || "professional"}.
    Use proper headings and markdown formatting.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      success: true,
      content: text,
    });

  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ error: "AI generation failed" });
  }
};
