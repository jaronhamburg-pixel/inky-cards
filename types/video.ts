export interface VideoGreeting {
  id: string;
  orderId: string;
  videoUrl: string;
  qrCodeUrl: string;
  thumbnailUrl?: string;
  duration: number;
  uploadedAt: Date;
}

export interface VideoRecordingState {
  isRecording: boolean;
  isPaused: boolean;
  recordedBlob: Blob | null;
  previewUrl: string | null;
  duration: number;
  maxDuration: number;
}
