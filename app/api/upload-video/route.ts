import { NextRequest, NextResponse } from 'next/server';
import { generateQRCodeDataUrl } from '@/lib/services/qr-service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const video = formData.get('video');

    if (!video || !(video instanceof File)) {
      return NextResponse.json(
        { error: 'A video file is required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!video.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Uploaded file must be a video' },
        { status: 400 }
      );
    }

    // Generate a mock video URL (simulates uploading to a storage service)
    const mockVideoId = crypto.randomUUID();
    const mockVideoUrl = `/videos/${mockVideoId}.mp4`;

    // Generate a QR code that points to the video URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const videoPageUrl = `${baseUrl}/video/${mockVideoId}`;
    const qrCodeUrl = await generateQRCodeDataUrl(videoPageUrl);

    return NextResponse.json({
      url: mockVideoUrl,
      qrCodeUrl,
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    );
  }
}
