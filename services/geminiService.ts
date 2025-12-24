
import { GoogleGenAI, Type } from "@google/genai";
import { PrincipalData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAnalysis = async (data: PrincipalData[]) => {
  const summary = data.map(p => ({
    name: p.name,
    margin: p.margin,
    revenue: p.revenue,
    terms: p.creditTerms,
    barrier: p.barrierToEntry
  }));

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this principal performance data and provide 3-4 key strategic recommendations on which principals to prioritize for growth vs maintenance. Focus on the high margin, high revenue "Sweet Spot" vs low barrier opportunities. Data: ${JSON.stringify(summary)}`,
    config: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 1000,
    }
  });

  return response.text;
};
