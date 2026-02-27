'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

type CaptureState = 'idle' | 'countdown' | 'flash' | 'preview';

interface PhotoCaptureProps {
  onPhotoReady: (blob: Blob, previewUrl: string) => void;
  onCancel: () => void;
}

export function PhotoCapture({ onPhotoReady, onCancel }: PhotoCaptureProps) {
  const [state, setState] = useState<CaptureState>('idle');
  const [countdownValue, setCountdownValue] = useState(3);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const cleanupTimers = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanupStream();
      cleanupTimers();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Camera access was denied. Please allow camera permissions in your browser settings.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera found. Please connect a camera to take a photo.');
        } else {
          setError(`Could not access camera: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred while accessing the camera.');
      }
    }
  }, []);

  useEffect(() => {
    if (state === 'idle') {
      initCamera();
    }
  }, [state, initCamera]);

  const startCountdown = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setCapturedBlob(null);
    setState('countdown');
    setCountdownValue(3);

    let count = 3;
    countdownTimerRef.current = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
        takePhoto();
      } else {
        setCountdownValue(count);
      }
    }, 1000);
  }, [previewUrl]);

  const takePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    // Flash effect
    setState('flash');
    setTimeout(() => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        setCapturedBlob(blob);
        setPreviewUrl(url);
        setState('preview');
        cleanupStream();
      }, 'image/jpeg', 0.92);
    }, 200);
  }, [cleanupStream]);

  const handleRetake = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setCapturedBlob(null);
    cleanupTimers();
    setState('idle');
  }, [previewUrl, cleanupTimers]);

  const handleUsePhoto = useCallback(() => {
    if (capturedBlob && previewUrl) {
      onPhotoReady(capturedBlob, previewUrl);
    }
  }, [capturedBlob, previewUrl, onPhotoReady]);

  const handleCancel = useCallback(() => {
    cleanupStream();
    cleanupTimers();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    onCancel();
  }, [cleanupStream, cleanupTimers, previewUrl, onCancel]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 rounded-xl bg-neutral-900 p-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-900/30">
          <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="max-w-sm text-sm text-neutral-300">{error}</p>
        <Button variant="outline" onClick={handleCancel} className="border-neutral-600 text-neutral-300 hover:bg-neutral-800 hover:text-white">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative w-full overflow-hidden rounded-xl bg-neutral-900" style={{ aspectRatio: '4 / 3' }}>
        {/* Live camera feed */}
        {state !== 'preview' && (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        )}

        {/* Preview */}
        {state === 'preview' && previewUrl && (
          <img src={previewUrl} alt="Captured photo" className="h-full w-full object-cover" />
        )}

        {/* Countdown overlay */}
        {state === 'countdown' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span
              key={countdownValue}
              className="animate-ping text-8xl font-bold text-white drop-shadow-lg"
              style={{
                animationDuration: '0.8s',
                animationIterationCount: '1',
                animationFillMode: 'forwards',
              }}
            >
              {countdownValue}
            </span>
          </div>
        )}

        {/* Flash overlay */}
        {state === 'flash' && (
          <div className="absolute inset-0 bg-white animate-pulse" style={{ animationDuration: '0.2s' }} />
        )}
      </div>

      {/* Controls */}
      <div className="flex w-full items-center justify-center gap-3">
        {state === 'idle' && (
          <>
            <Button variant="ghost" onClick={handleCancel} className="text-neutral-500 hover:text-neutral-300">
              Cancel
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={startCountdown}
              className="bg-ink text-white hover:bg-ink/90"
            >
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Take Photo
            </Button>
          </>
        )}

        {state === 'countdown' && (
          <Button
            variant="ghost"
            onClick={() => {
              cleanupTimers();
              setState('idle');
            }}
            className="text-neutral-400 hover:text-neutral-200"
          >
            Cancel
          </Button>
        )}

        {state === 'preview' && (
          <>
            <Button variant="ghost" onClick={handleCancel} className="text-neutral-500 hover:text-neutral-300">
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleRetake}
              className="border-neutral-600 text-neutral-300 hover:bg-neutral-800 hover:text-white"
            >
              Retake
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleUsePhoto}
              className="bg-ink text-white hover:bg-ink/90"
            >
              Use This Photo
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
