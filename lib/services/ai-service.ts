import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

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
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const toneDescriptions = {
      formal: 'elegant, sophisticated, and professionally worded',
      casual: 'friendly, relaxed, and conversational',
      heartfelt: 'warm, sincere, and emotionally resonant',
      humorous: 'light-hearted, witty, and fun',
    };

    const enhancedPrompt = `
You are a luxury greeting card writer for Inky Cards, a premium greeting card brand.

Create card text with these specifications:
- Occasion: ${occasion}
- Customer Request: ${prompt}
- Tone: ${toneDescriptions[tone]}

Requirements:
- Front text: A brief, elegant heading or greeting (2-8 words maximum)
- Inside text: A thoughtful message (2-4 sentences, maximum 150 words)
- Style: Sophisticated, meaningful, and appropriate for a luxury greeting card
- No profanity, controversial content, or generic phrases
- Make it personal and memorable

Format your response as JSON with this structure:
{
  "frontText": "Your front text here",
  "insideText": "Your inside text here"
}

Provide ONLY the JSON, no additional commentary.
`;

    const result = await model.generateContent(enhancedPrompt);
    const responseText = result.response.text();

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from AI');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      frontText: parsed.frontText || 'Celebrate',
      insideText: parsed.insideText || prompt,
    };
  } catch (error) {
    console.error('Error generating card text:', error);
    // Fallback response
    return {
      frontText: 'Special Wishes',
      insideText:
        'May this moment bring joy and happiness. Wishing you all the best as you celebrate this special occasion.',
    };
  }
}

export function generateCardImage(occasion: string, style: string = 'elegant'): string {
  // For MVP: Use picsum.photos with seeded URLs for consistent placeholder images
  // In production, this would use Gemini Imagen or another AI image generator

  const seed = `${occasion}-${style}`;

  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/1200`;
}

export function containsInappropriateContent(text: string): boolean {
  // Basic content moderation
  const inappropriateWords = [
    'badword1',
    'badword2',
    // Add more as needed for production
  ];

  const lowerText = text.toLowerCase();
  return inappropriateWords.some((word) => lowerText.includes(word));
}
