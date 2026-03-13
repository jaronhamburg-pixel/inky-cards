import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
} from '@react-email/components';
import type { Order } from '@/types/order';

const INK = '#1a1a1a';
const PAPER = '#faf9f7';
const STONE = '#6b6b6b';

export function ShippingUpdateEmail({
  order,
  trackingUrl,
}: {
  order: Order;
  trackingUrl?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://inkycards.com';

  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: PAPER, fontFamily: '"DM Sans", system-ui, sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 20px' }}>
          <Text style={{ fontSize: '24px', fontFamily: '"Cormorant Garamond", Georgia, serif', color: INK, textAlign: 'center' as const, margin: '0 0 8px' }}>
            Inky Cards
          </Text>
          <Text style={{ fontSize: '14px', color: STONE, textAlign: 'center' as const, margin: '0 0 32px' }}>
            Your order is on its way!
          </Text>

          <Section style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
            <Text style={{ fontSize: '16px', color: INK, fontWeight: 600, margin: '0 0 12px' }}>
              Hi {order.customer.firstName},
            </Text>
            <Text style={{ fontSize: '14px', color: STONE, margin: '0 0 16px', lineHeight: '1.6' }}>
              Great news — your order {order.orderNumber} has been shipped and is on its way to you.
            </Text>

            {trackingUrl && (
              <Link
                href={trackingUrl}
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
                Track Your Order
              </Link>
            )}

            <Text style={{ fontSize: '13px', color: STONE, margin: '16px 0 0', lineHeight: '1.6' }}>
              Shipping to:<br />
              {order.shipping.address}, {order.shipping.city}, {order.shipping.state} {order.shipping.zip}
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
