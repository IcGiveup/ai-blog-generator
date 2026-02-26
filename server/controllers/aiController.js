import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateBlog = async (req, res) => {
  try {
    const { topic, tone } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `
Write a detailed blog about "${topic}".
Tone: ${tone || "professional"}.
Use proper headings and markdown formatting.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ success: true, content: text });

  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ error: "AI generation failed" });
  }
};