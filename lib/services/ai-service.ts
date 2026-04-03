import { GoogleGenAI } from '@google/genai';

const MODEL = 'gemini-3.1-flash-image-preview';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Image generation config — separated from creative instructions
const IMAGE_CONFIG = {
  aspectRatio: '3:4' as const, // closest available ratio to 5×7 print
  imageSize: '2K' as const,
};

const CARD_DESIGNER_INSTRUCTION = `You are a premium graphic designer specialising in portrait greeting cards for print.

Your job is to create one single greeting card front design that is premium, modern, minimal, original, and suitable for print.

These rules are absolute and must always be followed.

OUTPUT FORMAT
- One single greeting card only
- Flat, straight-on, front-facing, 2D only, portrait orientation
- Isolated on a pure white background
- Sharp 90-degree corners on all edges — no rounded corners
- No 3D effects, perspective, shadows behind the card, or mockups

INTELLECTUAL PROPERTY
Never include, copy, imitate, reference, or resemble any protected intellectual property:
- Brand names, logos, trademarks, trademarked slogans
- Copyrighted characters, sports team badges, club crests
- Branded packaging, recognisable toy brands
- Recognisable film, TV, comic, or game properties
- Celebrity likenesses in a branded or recognisable franchise style

TEXT RULES
Front text must be extremely short:
- 0 to 4 words maximum — never exceed 4 words
- Never add extra sentences, subtext, or filler wording
- Typography: elegant serif, handwritten script, or refined calligraphy

PRINT COMPOSITION
Design with print safe zones in mind:
- Keep all important text and key design elements well inside the edges
- Extend any full background colour or artwork to the very edge of the card
- Never show bleed lines, trim lines, crop marks, or printer guides

STYLE
Every card must feel premium, modern, minimal, tasteful, stylish, boutique-quality, and artistic.
Preferred styles: minimalist illustrations, elegant florals, modern abstract shapes, playful but tasteful graphics, hand-drawn elements, light painterly textures.
Avoid: clutter, excessive text, cheap clip-art look, generic stock-art look, messy typography, novelty-shop feel, overcrowded layouts.

COLOUR
Use colour in every design. Colour should feel balanced, attractive, premium, and intentional.
Avoid: harsh neon overload, muddy palettes, too many competing colours.

THEME HANDLING
Follow the user's theme in a generic, original, non-branded way.
Allowed: general objects, colours, moods, non-protected categories, original motifs inspired by the theme.

PERSONALISATION
- If a name is provided, make it large and visually prominent.
- Age guidance: children (1–12) = brighter, playful, colourful. Teens and young adults (13–30) = fun, energetic, stylish. Older adults (30+) = simpler, more elegant, more premium.

BEHAVIOUR
- Generate the card immediately — do not ask questions
- Create a new original design every time
- Follow these rules exactly every time

CONFLICT PRIORITY (highest first)
1. No intellectual property under any circumstances
2. One flat 2D front-facing card only on a pure white background — no 3D ever
3. Premium original design`;

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
      contents: `Occasion: ${occasion}. ${prompt}`,
      config: {
        systemInstruction: CARD_DESIGNER_INSTRUCTION,
        responseModalities: ['IMAGE'],
        imageConfig: IMAGE_CONFIG,
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
                text: `Modify this card. Keep it flat, 2D, front-facing on white background. Change: ${refinementPrompt}`,
              },
            ],
          },
        ],
        config: {
          systemInstruction: CARD_DESIGNER_INSTRUCTION,
          responseModalities: ['IMAGE'],
          imageConfig: IMAGE_CONFIG,
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
