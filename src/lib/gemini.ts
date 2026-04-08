import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generatePoster(
  baseImageBase64: string,
  mpImageBase64: string | null,
  message: string
) {
  const model = "gemini-3.1-flash-image-preview";

  const parts: any[] = [
    {
      inlineData: {
        data: baseImageBase64.split(",")[1] || baseImageBase64,
        mimeType: "image/png",
      },
    },
    {
      text: `Rework this voter registration poster. 
      CRITICAL INSTRUCTION: There is a card in the hand (often mistaken for a joker or Jack) that has a spade symbol on it. REMOVE that spade symbol entirely from that card. 
      
      INTEGRATION: ${mpImageBase64 ? "Integrate the provided MP's image into the poster professionally." : "Make space for an MP's image or integrate a generic professional figure if not provided."}
      
      MESSAGE: Include this message for the youth: "${message}"
      
      STYLE: The style should be bold, dramatic, and attention-grabbing, suitable for a youth voter registration campaign. Keep the core elements like the hand holding the cards and the IEBC slip, but modernize and polish the overall design. Ensure the text is highly legible and the composition is balanced.`,
    },
  ];

  if (mpImageBase64) {
    parts.push({
      inlineData: {
        data: mpImageBase64.split(",")[1] || mpImageBase64,
        mimeType: "image/png",
      },
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: "1K",
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image generated");
}
