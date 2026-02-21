import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

export interface GenerateCardTextParams {
  occasion: string;
  prompt: string;
  tone?: 'formal' | 'casual' | 'heartfelt' | 'humorous';
}

export interface GeneratedCard {
  frontText: string;
  insideText: string;
  imageUrl: string;
}

export async function generateCardText({
  occasion,
  prompt,
  tone = 'heartfelt',
}: GenerateCardTextParams): Promise<{ frontText: string; insideText: string }> {
  try {
    const toneDescriptions = {
      formal: 'elegant, sophisticated, and professionally worded',
      casual: 'friendly, relaxed, and conversational',
      heartfelt: 'warm, sincere, and emotionally resonant',
      humorous: 'light-hearted, witty, and fun',
    };

    const result = await openai.chat.completions.create({
      model: 'gpt-5.2',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are a luxury greeting card writer for Inky Cards, a premium greeting card brand. You always respond in valid JSON with keys "frontText" and "insideText".`,
        },
        {
          role: 'user',
          content: `Create card text with these specifications:
- Occasion: ${occasion}
- Customer Request: ${prompt}
- Tone: ${toneDescriptions[tone]}

Requirements:
- frontText: A brief, elegant heading or greeting (2-8 words maximum)
- insideText: A thoughtful message (2-4 sentences, maximum 150 words)
- Style: Sophisticated, meaningful, and appropriate for a luxury greeting card
- No profanity, controversial content, or generic phrases
- Make it personal and memorable`,
        },
      ],
    });

    const text = result.choices[0].message.content || '{}';
    const parsed = JSON.parse(text);
    return {
      frontText: parsed.frontText || 'Celebrate',
      insideText: parsed.insideText || prompt,
    };
  } catch (error) {
    console.error('Error generating card text:', error);
    return {
      frontText: 'Special Wishes',
      insideText:
        'May this moment bring joy and happiness. Wishing you all the best as you celebrate this special occasion.',
    };
  }
}

export async function generateCardImage(occasion: string, style: string = 'elegant', userPrompt: string = ''): Promise<string> {
  try {
    const styleDescriptions: Record<string, string> = {
      elegant: 'refined, sophisticated watercolour with gold accents and delicate flourishes',
      minimalist: 'clean, minimal line art with ample white space and subtle tones',
      artistic: 'bold, expressive illustration with rich textures and vibrant colour',
      modern: 'contemporary graphic design with geometric shapes and a fresh palette',
    };

    const imagePrompt = `Design the front of a premium luxury greeting card for a ${occasion} occasion. Style: ${styleDescriptions[style] || style}. ${userPrompt ? `Theme: ${userPrompt}.` : ''} The design should be beautiful, print-ready, portrait orientation, with no text or words on the image. High quality, elegant, suitable for a luxury stationery brand.`;

    const result = await openai.images.generate({
      model: 'gpt-image-1.5',
      prompt: imagePrompt,
      size: '1024x1792',
      quality: 'high',
    });

    const image = result.data?.[0];
    if (!image) throw new Error('No image data returned');

    if (image.b64_json) {
      return `data:image/png;base64,${image.b64_json}`;
    }

    if (image.url) {
      return image.url;
    }

    throw new Error('No image data returned');
  } catch (error) {
    console.error('Error generating card image:', error);
    // Fallback to placeholder
    const seed = `${occasion}-${style}`;
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/1200`;
  }
}

export function containsInappropriateContent(text: string): boolean {
  const inappropriateWords = [
    'badword1',
    'badword2',
  ];

  const lowerText = text.toLowerCase();
  return inappropriateWords.some((word) => lowerText.includes(word));
}
