import QRCode from 'qrcode';

export async function generateQRCodeDataUrl(url: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#2C2C2C',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    });
    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

export async function generateQRCodeSVG(url: string): Promise<string> {
  try {
    const svg = await QRCode.toString(url, {
      type: 'svg',
      width: 300,
      margin: 2,
      color: {
        dark: '#2C2C2C',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    });
    return svg;
  } catch (error) {
    console.error('Error generating QR code SVG:', error);
    throw new Error('Failed to generate QR code');
  }
}

export function getVideoGreetingUrl(orderId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/orders/${orderId}`;
}
