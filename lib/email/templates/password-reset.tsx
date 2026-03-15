import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
} from '@react-email/components';
import { INK, PAPER, STONE } from '../constants';

export function PasswordResetEmail({
  name,
  resetUrl,
}: {
  name: string;
  resetUrl: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://inkycards.com';

  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: PAPER, fontFamily: '"DM Sans", system-ui, sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 20px' }}>
          <Text style={{ fontSize: '24px', fontFamily: '"Cormorant Garamond", Georgia, serif', color: INK, textAlign: 'center' as const, margin: '0 0 32px' }}>
            Inky Cards
          </Text>

          <Section style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
            <Text style={{ fontSize: '16px', color: INK, fontWeight: 600, margin: '0 0 12px' }}>
              Hi {name},
            </Text>
            <Text style={{ fontSize: '14px', color: STONE, margin: '0 0 20px', lineHeight: '1.6' }}>
              We received a request to reset your password. Click the button below to choose a new one. This link expires in 1 hour.
            </Text>

            <Link
              href={resetUrl}
              style={{
                display: 'inline-block',
                backgroundColor: INK,
                color: '#ffffff',
                padding: '12px 24px',
                fontSize: '13px',
                textDecoration: 'none',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.05em',
              }}
            >
              Reset Password
            </Link>

            <Text style={{ fontSize: '13px', color: STONE, margin: '20px 0 0', lineHeight: '1.6' }}>
              If you didn&apos;t request this, you can safely ignore this email. Your password will remain unchanged.
            </Text>
          </Section>

          <Text style={{ fontSize: '12px', color: STONE, textAlign: 'center' as const }}>
            <Link href={baseUrl} style={{ color: STONE }}>inkycards.com</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
