'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface QRDisplayProps {
  url: string;
  size?: number;
  label?: string;
  downloadable?: boolean;
}

export function QRDisplay({ url, size = 200, label, downloadable = true }: QRDisplayProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function generateQR() {
      try {
        setLoading(true);
        // Dynamic import to avoid SSR issues with qrcode
        const QRCode = (await import('qrcode')).default;
        const dataUrl = await QRCode.toDataURL(url, {
          width: size,
          margin: 2,
          color: {
            dark: '#2C2C2C',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'M',
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        setError('Failed to generate QR code');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (url) {
      generateQR();
    }
  }, [url, size]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = 'inky-cards-qr-code.png';
    link.href = qrDataUrl;
    link.click();
  };

  if (loading) {
    return (
      <div
        className="bg-neutral-100 rounded-lg flex items-center justify-center animate-pulse"
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-neutral-400">Generating QR...</span>
      </div>
    );
  }

  if (error || !qrDataUrl) {
    return (
      <div
        className="bg-neutral-100 rounded-lg flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-red-500">{error || 'QR unavailable'}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="bg-white p-3 rounded-lg border border-neutral-200 shadow-sm">
        <img
          src={qrDataUrl}
          alt="QR Code"
          width={size}
          height={size}
          className="block"
        />
      </div>
      {label && <p className="text-sm text-neutral-600 text-center">{label}</p>}
      {downloadable && (
        <Button variant="ghost" size="sm" onClick={handleDownload}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download QR Code
        </Button>
      )}
    </div>
  );
}
