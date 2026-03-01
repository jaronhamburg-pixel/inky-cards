import { GoogleGenAI } from '@google/genai';

const MODEL = 'gemini-3.1-flash-image-preview';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const CARD_DESIGNER_INSTRUCTION = `Act as a professional 'Card Designer' specialising in 5 x 7 greeting cards. Your goal is to help users design visually stunning and elegant greeting cards while adhering to specific physical constraints and stylistic preferences.

Purpose and Goals:
- Create high-quality designs specifically for the 5 x 7 inch format.
- Focus on premium aesthetics with minimal, impactful text, ensuring designs feel fun and unique.
- Ensure all designs are original and free from any trademarks or logos.

Behaviours and Rules:

Layout Constraints:
- Strictly maintain all design elements within a 5 x 7 inch canvas.
- Maintain consistent margins and bleed areas for print-ready output.

Content and Style:
- Prioritise limited, meaningful text over long messages. Use premium font styles like serif or elegant scripts.
- Focus on high-end visual elements such as minimalist illustrations, abstract patterns, or floral motifs with a premium and luxury feel. Cards should include colour.
- Do not incorporate any third-party logos, branded characters, or trademarked slogans under any circumstances.
- Only create the 5x7 image, with nothing else in the background or surrounding. Do not show the envelope.
- Ensure correct capitalisation of letters and words. Text should be limited, with imagery covering a larger proportion of the frame. Text is restricted to phrases like 'Happy Birthday', 'Thank you', 'Good Luck', or 'Congratulations'.
- If a name is provided, it should be big and prominent. If an age is provided, the card's feel should reflect that age: younger should be fun and colourful, while older should be simple and premium.

Design Process:
- Immediately create the card based on the prompt and return a 5x7 2D image.
- Generate a completely new design every time while keeping the 5x7 sizing and bleed area consistent.
- Adopt a British persona—use British equivalents in prompts (e.g., 'football' refers to soccer, not American football).

Overall Tone:
- Professional, creative, detail-oriented, modern, and simple.
- Limit design elements to ensure a 'handmade' feel.
- Maintain clarity and precision regarding technical specifications.`;

export interface GenerateCardResult {
  frontText: string;
  insideText: string;
  imageUrl: string;
  responseId: string;
}

// In-memory store for last generated image data (used for refinement)
const imageCache = new Map<string, string>();

export async function generateCard({
  occasion,
  prompt,
  tone = 'heartfelt',
  style = 'elegant',
}: {
  occasion: string;
  prompt: string;
  tone?: 'formal' | 'casual' | 'heartfelt' | 'humorous';
  style?: string;
}): Promise<GenerateCardResult> {
  const toneDescriptions = {
    formal: 'elegant, sophisticated, and professionally worded',
    casual: 'friendly, relaxed, and conversational',
    heartfelt: 'warm, sincere, and emotionally resonant',
    humorous: 'light-hearted, witty, and fun',
  };

  const styleDescriptions: Record<string, string> = {
    elegant: 'refined, sophisticated watercolour with gold accents and delicate flourishes',
    minimalist: 'clean, minimal line art with ample white space and subtle tones',
    artistic: 'bold, expressive illustration with rich textures and vibrant colour',
    modern: 'contemporary graphic design with geometric shapes and a fresh palette',
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: `Design a 5 x 7 greeting card for a ${occasion} occasion.

Customer request: ${prompt}
Tone: ${toneDescriptions[tone]}
Visual style: ${styleDescriptions[style] || style}

Also provide the card text as JSON with keys "frontText" and "insideText":
- frontText: A brief, elegant heading or greeting for the front (2-8 words maximum)
- insideText: A thoughtful message for the inside (2-4 sentences, maximum 150 words)

Return the JSON text alongside the card image.`,
      config: {
        systemInstruction: CARD_DESIGNER_INSTRUCTION,
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    let frontText = 'Special Wishes';
    let insideText = 'May this moment bring joy and happiness. Wishing you all the best as you celebrate this special occasion.';
    let imageUrl = `https://picsum.photos/seed/${encodeURIComponent(`${occasion}-${style}`)}/800/1200`;
    let responseId = '';

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.text) {
        const jsonMatch = part.text.match(/\{[\s\S]*"frontText"[\s\S]*"insideText"[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            frontText = parsed.frontText || frontText;
            insideText = parsed.insideText || insideText;
          } catch {
            // Keep defaults if JSON parsing fails
          }
        }
      } else if (part.inlineData?.mimeType?.startsWith('image/')) {
        imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        responseId = crypto.randomUUID();
        imageCache.set(responseId, imageUrl);
      }
    }

    return { frontText, insideText, imageUrl, responseId };
  } catch (error) {
    console.error('Error generating card:', error);
    return {
      frontText: 'Special Wishes',
      insideText: 'May this moment bring joy and happiness. Wishing you all the best as you celebrate this special occasion.',
      imageUrl: `https://picsum.photos/seed/${encodeURIComponent(`${occasion}-${style}`)}/800/1200`,
      responseId: '',
    };
  }
}

export interface ImageGenerationResult {
  imageUrl: string;
  responseId: string;
}

export async function refineCardImage(
  previousResponseId: string,
  refinementPrompt: string,
): Promise<ImageGenerationResult> {
  const previousImageUrl = imageCache.get(previousResponseId);

  if (previousImageUrl) {
    const match = previousImageUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      const [, mimeType, base64Data] = match;
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
              {
                text: `This is a 5 x 7 greeting card. Please modify it based on this request: ${refinementPrompt}. Keep it as a premium 5 x 7 card design with consistent margins and bleed areas.`,
              },
            ],
          },
        ],
        config: {
          systemInstruction: CARD_DESIGNER_INSTRUCTION,
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData?.mimeType?.startsWith('image/')) {
          const imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          const responseId = crypto.randomUUID();
          imageCache.set(responseId, imageUrl);
          imageCache.delete(previousResponseId);
          return { imageUrl, responseId };
        }
      }
    }
  }

  throw new Error('No image data in refinement response');
}

export function containsInappropriateContent(text: string): boolean {
  const inappropriateWords = ['badword1', 'badword2'];
  const lowerText = text.toLowerCase();
  return inappropriateWords.some((word) => lowerText.includes(word));
}
