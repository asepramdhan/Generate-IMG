import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedPrompts } from "../types";

// Initialize Gemini Client
// @ts-ignore - process.env.API_KEY is injected by the environment
const apiKey = process.env.API_KEY; 
const ai = new GoogleGenAI({ apiKey: apiKey });

/**
 * Analyzes the article text and generates optimized English image prompts.
 */
export const analyzeAndCreatePrompts = async (articleText: string): Promise<GeneratedPrompts> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      thumbnailPrompt: {
        type: Type.STRING,
        description: "A highly detailed, visual description in English for a 16:9 YouTube-style thumbnail. Should be metaphorical, high contrast, and cyber-security themed.",
      },
      thumbnailTitle: {
        type: Type.STRING,
        description: "A short, catchy title for the thumbnail concept.",
      },
      illustrationPrompt: {
        type: Type.STRING,
        description: "A detailed description in English for a 4:3 editorial illustration depicting the specific concepts discussed in the text (e.g., AI vs AI defense).",
      },
      illustrationTitle: {
        type: Type.STRING,
        description: "A short title for the illustration concept.",
      },
    },
    required: ["thumbnailPrompt", "thumbnailTitle", "illustrationPrompt", "illustrationTitle"],
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Analyze the following article (which may be in Indonesian) and create two distinct image generation prompts in English.
    
    Article Context:
    ${articleText.substring(0, 8000)}`, // Truncate to avoid context limit if extremely long
    config: {
      systemInstruction: "You are an expert creative director for a cybersecurity tech blog. Your goal is to create compelling visual descriptions for AI image generators.",
      responseMimeType: "application/json",
      responseSchema: schema,
    }
  });

  const jsonText = response.text;
  if (!jsonText) throw new Error("Failed to generate prompts");
  
  return JSON.parse(jsonText) as GeneratedPrompts;
};

/**
 * Generates an image based on a prompt using Gemini 2.5 Flash Image.
 */
export const generateImage = async (prompt: string, aspectRatio: "16:9" | "4:3"): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          // note: imageSize is not supported on flash-image standard, only pro-image-preview
        }
      }
    });

    // Extract image from parts
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
};
