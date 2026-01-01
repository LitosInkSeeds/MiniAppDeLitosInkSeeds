
import { GoogleGenAI } from "@google/genai";
import { CycleState } from '../types';

export const getEnergyInterpretation = async (state: CycleState): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "Configura API_KEY para obtener guía espiritual.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Interpreta la energía de hoy: Chakra ${state.chakraName}, Elemento ${state.elementName}, Luna ${state.moonPhase}. Da un consejo breve de 1 frase. Texto plano sin markdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text;
    return typeof text === 'string' ? text.trim() : "Fluye con la energía del presente.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Siente la conexión con el cosmos en silencio.";
  }
};
