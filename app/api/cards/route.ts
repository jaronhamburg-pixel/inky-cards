import { NextRequest, NextResponse } from 'next/server';
import { getAllCards, searchCards, addCard } from '@/lib/db/cards';
import { sanitizeObject } from '@/lib/utils/sanitize';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');

    let cards = query ? await searchCards(query) : await getAllCards();

    if (category && category !== 'all') {
      cards = cards.filter((c) => c.category === category);
    }

    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const card = await addCard(sanitizeObject(body));
    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
}
