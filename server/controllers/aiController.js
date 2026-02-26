import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateBlog = async (req, res) => {
  try {
    const { topic, tone } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const prompt = `
Write a detailed blog about "${topic}".
Tone: ${tone || "professional"}.
Use proper headings and markdown formatting.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",   // fast & cheap
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const text = response.choices[0].message.content;

    res.json({
      success: true,
      content: text,
    });

  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ error: "AI generation failed" });
  }
};