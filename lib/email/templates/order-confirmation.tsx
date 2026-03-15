import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Link,
} from '@react-email/components';
import type { Order } from '@/types/order';
import { INK, PAPER, STONE } from '../constants';

export function OrderConfirmationEmail({ order }: { order: Order }) {
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
            Order Confirmation
          </Text>

          <Section style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
            <Text style={{ fontSize: '16px', color: INK, fontWeight: 600, margin: '0 0 16px' }}>
              Thank you for your order, {order.customer.firstName}!
            </Text>
            <Text style={{ fontSize: '13px', color: STONE, margin: '0 0 4px' }}>
              Order: {order.orderNumber}
            </Text>

            <Hr style={{ borderColor: '#e8e6e3', margin: '16px 0' }} />

            {order.items.map((item) => (
              <Section key={item.id} style={{ marginBottom: '12px' }}>
                <Text style={{ fontSize: '14px', color: INK, margin: '0 0 2px' }}>
                  {item.card.title} × {item.quantity}
                </Text>
                <Text style={{ fontSize: '13px', color: STONE, margin: 0 }}>
                  ${item.price.toFixed(2)} each
                </Text>
              </Section>
            ))}

            <Hr style={{ borderColor: '#e8e6e3', margin: '16px 0' }} />

            <Section>
              <Text style={{ fontSize: '13px', color: STONE, margin: '0 0 4px' }}>
                Subtotal: ${order.subtotal.toFixed(2)}
              </Text>
              <Text style={{ fontSize: '13px', color: STONE, margin: '0 0 4px' }}>
                Shipping: {order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost.toFixed(2)}`}
              </Text>
              <Text style={{ fontSize: '13px', color: STONE, margin: '0 0 4px' }}>
                Tax: ${order.tax.toFixed(2)}
              </Text>
              <Text style={{ fontSize: '16px', color: INK, fontWeight: 600, margin: '8px 0 0' }}>
                Total: ${order.total.toFixed(2)}
              </Text>
            </Section>
          </Section>

          <Section style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
            <Text style={{ fontSize: '14px', color: INK, fontWeight: 600, margin: '0 0 8px' }}>
              Shipping to
            </Text>
            <Text style={{ fontSize: '13px', color: STONE, margin: 0, lineHeight: '1.6' }}>
              {order.customer.firstName} {order.customer.lastName}<br />
              {order.shipping.address}<br />
              {order.shipping.city}, {order.shipping.state} {order.shipping.zip}<br />
              {order.shipping.country}
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
