'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';

type RecorderState = 'idle' | 'countdown' | 'recording' | 'preview';

interface VideoRecorderProps {
  onVideoReady: (blob: Blob, previewUrl: string) => void;
  onCancel: () => void;
  maxDuration?: number;
}

export function VideoRecorder({
  onVideoReady,
  onCancel,
  maxDuration = 60,
}: VideoRecorderProps) {
  const [state, setState] = useState<RecorderState>('idle');
  const [countdownValue, setCountdownValue] = useState(3);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const cleanupTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, []);

  const cleanupPreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setRecordedBlob(null);
  }, [previewUrl]);

  // Clean up everything on unmount
  useEffect(() => {
    return () => {
      cleanupStream();
      cleanupTimers();
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError(
            'Camera access was denied. Please allow camera and microphone permissions in your browser settings to record a video.'
          );
        } else if (err.name === 'NotFoundError') {
          setError(
            'No camera or microphone found. Please connect a camera and microphone to record a video.'
          );
        } else {
          setError(`Could not access camera: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred while accessing the camera.');
      }
    }
  }, []);

  // Initialize camera when entering idle state
  useEffect(() => {
    if (state === 'idle') {
      initCamera();
    }
  }, [state, initCamera]);

  const startCountdown = useCallback(() => {
    cleanupPreview();
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
        startRecording();
      } else {
        setCountdownValue(count);
      }
    }, 1000);
  }, []);

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm',
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedBlob(blob);
      setPreviewUrl(url);
      setState('preview');

      // Stop the live camera feed
      cleanupStream();
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(100);
    setState('recording');
    setElapsedTime(0);

    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => {
        const next = prev + 1;
        if (next >= maxDuration) {
          stopRecording();
        }
        return next;
      });
    }, 1000);
  }, [maxDuration, cleanupStream]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const handleReRecord = useCallback(() => {
    cleanupPreview();
    cleanupTimers();
    setElapsedTime(0);
    setState('idle');
  }, [cleanupPreview, cleanupTimers]);

  const handleUseVideo = useCallback(() => {
    if (recordedBlob && previewUrl) {
      onVideoReady(recordedBlob, previewUrl);
    }
  }, [recordedBlob, previewUrl, onVideoReady]);

  const handleCancel = useCallback(() => {
    cleanupStream();
    cleanupTimers();
    cleanupPreview();
    onCancel();
  }, [cleanupStream, cleanupTimers, cleanupPreview, onCancel]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 rounded-xl bg-neutral-900 p-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-900/30">
          <svg
            className="h-8 w-8 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
            <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
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
      {/* Video container */}
      <div className="relative w-full overflow-hidden rounded-xl bg-neutral-900" style={{ aspectRatio: '16 / 9' }}>
        {/* Live camera feed (idle, countdown, recording) */}
        {state !== 'preview' && (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        )}

        {/* Preview playback */}
        {state === 'preview' && previewUrl && (
          <video
            ref={previewVideoRef}
            src={previewUrl}
            controls
            playsInline
            className="h-full w-full object-cover"
          />
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

        {/* Recording indicator */}
        {state === 'recording' && (
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600" />
            </span>
            <span className="text-sm font-medium tabular-nums text-white">
              {formatTime(elapsedTime)}
            </span>
            <span className="text-xs text-neutral-400">
              / {formatTime(maxDuration)}
            </span>
          </div>
        )}

        {/* Max duration warning (last 10 seconds) */}
        {state === 'recording' && maxDuration - elapsedTime <= 10 && maxDuration - elapsedTime > 0 && (
          <div className="absolute right-4 top-4 rounded-full bg-red-600/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {maxDuration - elapsedTime}s remaining
          </div>
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
              <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
              </svg>
              Start Recording
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

        {state === 'recording' && (
          <Button
            variant="danger"
            size="lg"
            onClick={stopRecording}
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" />
            </svg>
            Stop Recording
          </Button>
        )}

        {state === 'preview' && (
          <>
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="text-neutral-500 hover:text-neutral-300"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleReRecord}
              className="border-neutral-600 text-neutral-300 hover:bg-neutral-800 hover:text-white"
            >
              Re-record
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleUseVideo}
              className="bg-ink text-white hover:bg-ink/90"
            >
              Use This Video
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
