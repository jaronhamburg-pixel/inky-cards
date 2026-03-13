'use client';

import { useRef, useState } from 'react';

export default function VideoPlayer({ url }: { url: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasEnded, setHasEnded] = useState(false);

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setHasEnded(false);
    }
  };

  return (
    <div>
      <div className="rounded-lg overflow-hidden bg-black shadow-2xl">
        <video
          ref={videoRef}
          src={url}
          controls
          autoPlay
          playsInline
          onEnded={() => setHasEnded(true)}
          className="w-full aspect-video"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="flex items-center justify-center gap-4 mt-6">
        {hasEnded && (
          <button
            onClick={handleReplay}
            className="px-6 py-2.5 text-xs uppercase tracking-widest text-paper border border-paper/30 rounded hover:bg-paper hover:text-ink transition-colors"
          >
            Play Again
          </button>
        )}
        <a
          href={url}
          download
          className="px-6 py-2.5 text-xs uppercase tracking-widest text-paper border border-paper/30 rounded hover:bg-paper hover:text-ink transition-colors"
        >
          Download
        </a>
      </div>
    </div>
  );
}
