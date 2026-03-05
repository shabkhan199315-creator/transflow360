import { GoogleGenAI, type GenerateContentResponse, Type, Modality } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const getGeminiClient = () => {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in the environment.");
  }
  return new GoogleGenAI({ apiKey });
};

export async function generateText(prompt: string, systemInstruction?: string) {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction,
    },
  });
  return response.text;
}

export async function analyzeImage(prompt: string, base64Image: string, mimeType: string) {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { text: prompt },
        {
          inlineData: {
            data: base64Image.split(',')[1] || base64Image,
            mimeType,
          },
        },
      ],
    },
  });
  return response.text;
}

export async function extractData(text: string, schema: any) {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extract the following data from this text: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });
  return JSON.parse(response.text || "{}");
}

export async function generateSpeech(text: string, voice: string = 'Kore') {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voice },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
}

export async function processAudio(prompt: string, base64Audio: string, mimeType: string) {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { text: prompt },
        {
          inlineData: {
            data: base64Audio.split(',')[1] || base64Audio,
            mimeType,
          },
        },
      ],
    },
  });
  return response.text;
}
