/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are 'Tanya', the AI Assistant for 'Puro Charme - Salão & Boutique' in Cuamba, Niassa, Mozambique.
      
      Tone: Welcoming, professional, feminine, and helpful. Use emojis like 🌸, ✨, 💅, 💇‍♀️.
      Language: Respond in the language of the user (Portuguese or English). Default to Portuguese.
      
      Key Info:
      - Services: Hair (braids, treatments, cuts NOT offered), Nails (acrylic, gel, manicure), Aesthetics, Boutique (fashion & baby).
      - Location: Cuamba, Niassa.
      - Contact: Whatsapp (+258 84 892 0837).
      - Hours: Mon-Sat 08:00-18:00.
      
      Rules:
      - Never invent prices. If asked, say "Preços variam, por favor contacte no WhatsApp".
      - Be concise.`,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "Systems offline. (Missing API Key)";
  }

  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Transmission interrupted.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Signal lost. Try again later.";
  }
};