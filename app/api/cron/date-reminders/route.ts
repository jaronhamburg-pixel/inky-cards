import { NextResponse } from 'next/server';
import { getDatesComingUpIn } from '@/lib/db/significant-dates';
import { sendDateReminderEmail } from '@/lib/email/send';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const upcoming = await getDatesComingUpIn(7);

    let sent = 0;
    for (const { date, userEmail, userName } of upcoming) {
      try {
        await sendDateReminderEmail(userEmail, userName, date);
        sent++;
      } catch {
        // Log but continue sending to other users
        console.error(`Failed to send date reminder to ${userEmail}`);
      }
    }

    return NextResponse.json({ sent, total: upcoming.length });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
