import { GoogleGenAI } from "@google/genai";
import { Operation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const explainMathConcept = async (
  num1: number, 
  num2: number, 
  operation: Operation
): Promise<string> => {
  const model = 'gemini-2.5-flash';
  
  let prompt = "";
  
  if (operation === Operation.MULTIPLY) {
    prompt = `Explain the multiplication problem ${num1} × ${num2} to a 6-year-old child. 
    Use a creative, short story involving animals, fruits, or toys to visualize it. 
    Keep the language very simple, encouraging, and fun. Use emojis. 
    Keep it under 100 words.`;
  } else {
    // Division
    prompt = `Explain the division problem ${num1} ÷ ${num2} to a 6-year-old child. 
    Describe it as sharing items equally among friends or groups. 
    Use a creative, short story. 
    Keep the language very simple, encouraging, and fun. Use emojis. 
    Keep it under 100 words.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text || "Oops! I couldn't think of a story right now. Try again!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the story-telling brain right now.";
  }
};