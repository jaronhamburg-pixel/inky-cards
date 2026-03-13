import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import VideoPlayer from './video-player';

export const metadata: Metadata = {
  title: 'Video Greeting',
  description: 'Watch your personal video greeting from Inky Cards.',
};

export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { videoId: id },
    select: { videoUrl: true, customerFirstName: true },
  });

  if (!order?.videoUrl) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="font-[family-name:var(--font-cormorant)] text-3xl text-paper mb-2">
          A message for you
        </h1>
        <p className="text-paper/50 text-sm mb-8">
          from {order.customerFirstName}
        </p>
        <VideoPlayer url={order.videoUrl} />
        <p className="text-paper/30 text-xs mt-8">
          Sent with love via Inky Cards
        </p>
      </div>
    </div>
  );
}
