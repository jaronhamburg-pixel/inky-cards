'use client';

export default function VideoPlayer({ url }: { url: string }) {
  return (
    <div className="rounded-lg overflow-hidden bg-black shadow-2xl">
      <video
        src={url}
        controls
        autoPlay
        playsInline
        className="w-full aspect-video"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
