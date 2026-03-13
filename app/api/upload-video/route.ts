import { NextRequest, NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';
import { generateQRCodeDataUrl } from '@/lib/services/qr-service';

const utapi = new UTApi();

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

    if (!video.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Uploaded file must be a video' },
        { status: 400 }
      );
    }

    // Upload to UploadThing
    const response = await utapi.uploadFiles(video);

    if (response.error) {
      console.error('UploadThing error:', response.error);
      return NextResponse.json(
        { error: 'Failed to upload video' },
        { status: 500 }
      );
    }

    const videoId = crypto.randomUUID();
    const videoUrl = response.data.ufsUrl;

    // Generate a QR code that points to the video playback page
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const videoPageUrl = `${baseUrl}/video/${videoId}`;
    const qrCodeUrl = await generateQRCodeDataUrl(videoPageUrl);

    return NextResponse.json({
      url: videoUrl,
      qrCodeUrl,
      videoId,
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    );
  }
}
