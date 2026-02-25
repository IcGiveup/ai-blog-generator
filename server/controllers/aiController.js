import { GoogleGenAI } from "@google/genai";

export const generateBlog = async (req, res) => {
  try {
    const { topic, tone } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        error: "Topic is required",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const outlineResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Create a structured blog outline about: ${topic}

        Include:
        - Introduction
        - 4-6 section headings
        - Conclusion

        Return only bullet points.
      `,
    });

    const outline = outlineResponse.text;

    const expandedResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Expand the following outline into a complete blog article.

        Tone: ${tone}

        Outline:
        ${outline}

        Write in clear markdown format.
      `,
    });

    const finalBlog = expandedResponse.text;

    res.status(200).json({
      success: true,
      content: finalBlog,
      outline: outline,
    });

  } catch (error) {
    console.error("FULL ERROR:", error);

    res.status(500).json({
      success: false,
      error: "AI generation failed",
    });
  }
};