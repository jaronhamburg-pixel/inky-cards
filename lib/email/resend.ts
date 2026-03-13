import { Resend } from 'resend';

const globalForResend = globalThis as unknown as { resend: Resend };

function createResendClient() {
  // Use a placeholder key if not configured — sends will fail gracefully
  return new Resend(process.env.RESEND_API_KEY || 're_placeholder');
}

export const resend =
  globalForResend.resend || createResendClient();

if (process.env.NODE_ENV !== 'production') globalForResend.resend = resend;
