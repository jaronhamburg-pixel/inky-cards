import { NextRequest, NextResponse } from 'next/server';
import { generateCard, refineCardImage, containsInappropriateContent } from '@/lib/services/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { occasion, prompt, tone, style, previousResponseId, refinementPrompt } = body;

    // Refinement mode — tweak existing image
    if (previousResponseId && refinementPrompt) {
      if (containsInappropriateContent(refinementPrompt)) {
        return NextResponse.json(
          { error: 'Your prompt contains inappropriate content. Please revise and try again.' },
          { status: 400 }
        );
      }

      const { imageUrl, responseId } = await refineCardImage(previousResponseId, refinementPrompt);

      return NextResponse.json({
        success: true,
        imageUrl,
        responseId,
      });
    }

    // Initial generation
    if (!occasion || !prompt) {
      return NextResponse.json(
        { error: 'Occasion and prompt are required' },
        { status: 400 }
      );
    }

    if (prompt.length > 500) {
      return NextResponse.json(
        { error: 'Prompt must be less than 500 characters' },
        { status: 400 }
      );
    }

    if (containsInappropriateContent(prompt)) {
      return NextResponse.json(
        { error: 'Your prompt contains inappropriate content. Please revise and try again.' },
        { status: 400 }
      );
    }

    // Generate card text and image in a single call
    const { frontText, insideText, imageUrl, responseId } = await generateCard({
      occasion,
      prompt,
      tone: tone || 'heartfelt',
      style: style || 'elegant',
    });

    return NextResponse.json({
      success: true,
      card: {
        frontText,
        insideText,
        imageUrl,
        occasion,
        style: style || 'elegant',
      },
      responseId,
    });
  } catch (error) {
    console.error('Error in generate-card API:', error);
    return NextResponse.json(
      { error: 'Failed to generate card. Please try again.' },
      { status: 500 }
    );
  }
}
