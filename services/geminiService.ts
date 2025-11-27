import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Monument } from "../types";

// Helper to convert blob to base64
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export class GeminiService {
  private ai: GoogleGenAI;
  private modelId = "gemini-2.5-flash";

  constructor() {
    // API key must be obtained exclusively from process.env.API_KEY
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async sendMessage(
    history: { role: string; parts: any[] }[],
    newMessage: string | null,
    imageBlob: Blob | null,
    audioBlob: Blob | null,
    context: Monument
  ): Promise<string> {
    
    const systemPrompt = `
      You are an expert Historian and Cultural Guide for Goa, India.
      The user is currently virtually visiting: ${context.name}.
      Context about this site: ${context.fullHistory}.
      
      Your goal is to provide engaging, accurate, and storytelling narratives.
      Answer questions specifically about this monument, its architecture, history, and cultural significance.
      Keep answers concise (under 150 words) unless asked for a detailed story.
      If the user sends an image, analyze it in the context of this monument.
      If the user speaks (audio), respond naturally to their query.
    `;

    try {
      // Construct the content parts
      const parts: any[] = [];

      if (audioBlob) {
        const audioBase64 = await blobToBase64(audioBlob);
        parts.push({
          inlineData: {
            mimeType: audioBlob.type || 'audio/webm',
            data: audioBase64
          }
        });
      }

      if (imageBlob) {
        const imageBase64 = await blobToBase64(imageBlob);
        parts.push({
          inlineData: {
            mimeType: imageBlob.type || 'image/jpeg',
            data: imageBase64
          }
        });
      }

      if (newMessage) {
        parts.push({ text: newMessage });
      }

      // If no input, just return empty (shouldn't happen with UI checks)
      if (parts.length === 0) return "Please provide input.";

      // We are using generateContent for a single turn with context, 
      // or we could simulate chat by appending history. 
      // For simplicity and robustness with multimodal, we'll send the history as context in the prompt 
      // or use the chat structure if strict text-only. 
      // However, 2.5-flash handles mixed modalities well in generateContent.
      
      // Let's build a chat-like structure manually for generateContent to ensure multimodal works smoothly
      // (Stateful chat object sometimes tricky with mixed media in older SDKs, but 2.5 is robust).
      // We will perform a stateless request including previous context if needed, 
      // but for this MVP, we focus on the immediate query + system context.
      
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: this.modelId,
        contents: [
          ...history.map(h => ({ role: h.role, parts: h.parts })), // Previous history
          { role: 'user', parts: parts } // Current message
        ],
        config: {
          systemInstruction: systemPrompt,
        }
      });

      return response.text || "I couldn't interpret that specifically, but ask me anything about the history!";

    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Sorry, I'm having trouble connecting to the history archives (API Error).";
    }
  }
}

export const geminiService = new GeminiService();