import { GoogleGenAI } from '@google/genai';

const MODEL = 'gemini-3.1-flash-image-preview';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const CARD_DESIGNER_INSTRUCTION = `You are a professional illustrator who creates premium artwork for printed stationery.

Output rules:
- Generate a single flat rectangular portrait illustration.
- The illustration fills the entire image — edge to edge, with no border, margin, or background visible around it.
- The output is ONLY the artwork itself — a single flat rectangle of artwork filling the full frame.

Design principles:
- Premium, boutique-quality, minimal, artistic, clean, stylish.
- Focus on simple, high-impact visuals. Visual elements should take up more space than text.
- Preferred illustration styles: minimalist illustrations, elegant florals, modern abstract shapes, playful but tasteful graphics, hand-drawn elements, light painterly textures.
- Avoid: stock-art appearance, clip-art styles, complex cluttered scenes.

Text rules:
- Text must be minimal and elegant.
- Only short greetings: Happy Birthday, Thank You, Congratulations, Good Luck, or a name/age if provided.
- Typography: elegant serif, handwritten script, or refined calligraphy. Avoid comic or childish fonts.

Personalisation:
- If a name is provided, make it large and visually prominent.
- If an age is provided: ages 1–18 bright and playful, 18–40 modern and trendy, 40+ elegant and minimal.

Colour: soft pastels, warm modern tones, muted luxury palettes, elegant contrasts. Avoid neon or overly saturated colours.

Originality: every design must be 100% original. No trademarks, logos, copyrighted characters, or branded references.

Composition: maintain balanced spacing, avoid overcrowding.`;

const OCCASION_FRONT_TEXT: Record<string, string> = {
  birthday: 'Happy Birthday',
  wedding: 'Congratulations',
  anniversary: 'Happy Anniversary',
  'thank-you': 'Thank You',
  sympathy: 'Thinking of You',
  congratulations: 'Congratulations',
  holiday: 'Happy Holidays',
  other: 'Special Wishes',
};

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
}: {
  occasion: string;
  prompt: string;
}): Promise<GenerateCardResult> {
  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: `Create a beautiful portrait illustration for a ${occasion} occasion. ${prompt}`,
      config: {
        systemInstruction: CARD_DESIGNER_INSTRUCTION,
        responseModalities: ['IMAGE'],
        imageConfig: {
          aspectRatio: '3:4',
          imageSize: '2K',
        },
      },
    });

    const frontText = OCCASION_FRONT_TEXT[occasion] || 'Special Wishes';
    let imageUrl = '';
    let responseId = '';

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.mimeType?.startsWith('image/')) {
        imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        responseId = crypto.randomUUID();
        imageCache.set(responseId, imageUrl);
      }
    }

    if (!imageUrl) {
      throw new Error('No image returned from Gemini');
    }

    return { frontText, insideText: '', imageUrl, responseId };
  } catch (error) {
    console.error('Error generating card:', error);
    throw error;
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
                text: `Modify this illustration based on this request: ${refinementPrompt}`,
              },
            ],
          },
        ],
        config: {
          systemInstruction: CARD_DESIGNER_INSTRUCTION,
          responseModalities: ['IMAGE'],
          imageConfig: {
            aspectRatio: '3:4',
            imageSize: '2K',
          },
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

const BLOCKED_TERMS = [
  'porn', 'xxx', 'nude', 'naked', 'sexting',
  'kill', 'murder', 'suicide', 'self-harm',
  'bomb', 'terrorist', 'terrorism',
  'racial slur', 'hate speech',
  'child abuse', 'child porn',
  'drug deal', 'meth', 'cocaine', 'heroin',
];

export function containsInappropriateContent(text: string): boolean {
  const lowerText = text.toLowerCase();
  return BLOCKED_TERMS.some((term) => lowerText.includes(term));
}
