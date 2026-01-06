import { GoogleGenAI, Type } from "@google/genai";
import { SocialProofItem } from "../types";

interface ImportMetaEnv {
  VITE_GEMINI_API_KEY: string;
}

interface ImportMeta {
  env: ImportMetaEnv; // Keep it simple for Vite
  // Add any other properties if needed
}

// Extend the global ImportMeta interface
declare global {
  interface ImportMeta {
    env: ImportMetaEnv;
  }
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Ensure TypeScript recognizes the env property

// 🔐 Safe initialization (NO CRASH)
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export async function summarizeSentiment(items: SocialProofItem[]) {
  // ✅ Demo fallback if API key missing
  if (!ai) {
    return {
      summary: "Our community loves the product experience and support.",
      highlights: ["High Quality", "Fast Support", "Great Value"]
    };
  }

  try {
    const prompt = `
Analyze the following customer feedback items and provide a concise, 2-sentence summary of the overall community sentiment.
Focus on the key strengths mentioned by users.

Feedback items:
${items.map(i => `- ${i.content}`).join("\n")}
`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            highlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 short punchy highlight phrases"
            }
          },
          required: ["summary", "highlights"]
        }
      }
    });

    // ✅ Safe JSON parse
    return JSON.parse(
      response.text ??
        JSON.stringify({
          summary: "Customers love our products!",
          highlights: ["Quality", "Service", "Value"]
        })
    );
  } catch (error) {
    console.error("Gemini Error:", error);

    // ✅ API failure fallback (NO BLANK UI)
    return {
      summary: "Our users consistently highlight quality and quick support.",
      highlights: ["Reliable Quality", "Helpful Support", "Fast Delivery"]
    };
  }
}
