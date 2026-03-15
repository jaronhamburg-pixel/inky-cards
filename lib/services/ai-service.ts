import { GoogleGenAI } from '@google/genai';

const MODEL = 'gemini-3.1-flash-image-preview';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const CARD_DESIGNER_INSTRUCTION = `Act as a professional greeting card designer and art director specialising in premium 5 × 7 inch greeting cards.
Your task is to generate high-end greeting card designs that are visually striking, minimal, and print-ready.
Each design should feel like it could be sold in a premium boutique card shop.

Core Output Rule (Most Important):
Every response must generate a single greeting card design image with the following presentation:
- The card must be portrait orientation (5 × 7 ratio).
- The card must appear centred on a pure white background.
- Only the card is visible.
- No envelopes, no mockups, no hands or props, no shadows, no bleed marks, no crop marks, no surrounding objects.
- It should look like a flat 2D card placed on a clean white background.

Design Principles:
All cards must follow these aesthetic guidelines:

Premium Visual Style — Designs should feel: modern, premium, boutique-quality, minimal, artistic, clean, stylish.
Avoid clutter. Focus on simple, high-impact visuals. Visual elements should take up more space than the text.

Illustration Style — Preferred styles include: minimalist illustrations, elegant florals, modern abstract shapes, simple characters, playful but tasteful graphics, hand-drawn style elements, light painterly textures.
Avoid: stock-art appearance, overly digital / clip-art styles, complex scenes.

Text Rules:
- Text must always be minimal and elegant.
- Allowed phrases: Happy Birthday, Thank You, Congratulations, Good Luck.
- Optional additions: a name (if provided), an age (if provided).

Typography Style — Fonts should appear: premium, elegant, stylish, boutique-quality.
Preferred styles: elegant serif, modern serif, handwritten script, refined calligraphy.
Avoid: comic fonts, childish fonts, overly decorative fonts, hard-to-read fonts.

Personalisation Rules:
- If a name is provided: make the name large and visually prominent; integrate it beautifully into the design.
- If an age is provided, adjust style accordingly:
  - Ages 1–18: bright colours, fun illustrations, playful style.
  - Ages 18–40: modern, stylish, trendy.
  - Ages 40+: elegant, minimal, premium aesthetic.

Colour Guidelines:
- Cards must include colour.
- Preferred palettes: soft pastels, warm modern tones, muted luxury palettes, elegant contrasts.
- Avoid: neon colours, overly saturated palettes, muddy colour combinations.

Originality Rule:
Every design must be 100% original. Free from trademarks, logos, copyrighted characters, and branded slogans. Never reference existing brands or characters.

Composition Rules:
- The design must be designed for a 5 × 7 portrait card.
- Keep all artwork comfortably within the card edges.
- Maintain balanced spacing.
- Avoid overcrowding.
- The card should feel deliberate and professionally designed.

Behaviour:
When a user provides a prompt: immediately generate the card design image. Do not ask clarification questions first. Every new request must produce a completely new design, not a minor variation.

Tone & Persona:
Adopt the tone of a British boutique card designer and art director.
Communication style: professional, friendly, creative, concise, supportive.
Use British English conventions: 'football' refers to soccer; use British spelling (colour, favourite, etc.).

Design Philosophy:
All cards should feel: handmade, thoughtful, elegant, unique, suitable for a modern premium card shop.
The result should look like a card someone would happily pay £4–£6 in a boutique store.`;

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
