import OpenAI from "openai";

export const generateBlog = async (req, res) => {
  try {
    const { topic, tone } = req.body;

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `Write a detailed blog about "${topic}" in a ${tone} tone.`,
        },
      ],
      temperature: 0.7,
    });

    res.json({
      success: true,
      content: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI generation failed" });
  }
};