import { resend } from './resend';
import { OrderConfirmationEmail } from './templates/order-confirmation';
import { ShippingUpdateEmail } from './templates/shipping-update';
import { PasswordResetEmail } from './templates/password-reset';
import { WelcomeEmail } from './templates/welcome';
import type { Order } from '@/types/order';

const FROM_ORDERS = 'Inky Cards <orders@inkycards.com>';
const FROM_NOREPLY = 'Inky Cards <noreply@inkycards.com>';

export async function sendOrderConfirmation(order: Order) {
  await resend.emails.send({
    from: FROM_ORDERS,
    to: order.customer.email,
    subject: `Order confirmed — ${order.orderNumber}`,
    react: OrderConfirmationEmail({ order }),
  });
}

export async function sendShippingUpdate(order: Order, trackingUrl?: string) {
  await resend.emails.send({
    from: FROM_ORDERS,
    to: order.customer.email,
    subject: `Your order ${order.orderNumber} has shipped`,
    react: ShippingUpdateEmail({ order, trackingUrl }),
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  await resend.emails.send({
    from: FROM_NOREPLY,
    to: email,
    subject: 'Welcome to Inky Cards',
    react: WelcomeEmail({ name }),
  });
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://inkycards.com';
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  await resend.emails.send({
    from: FROM_NOREPLY,
    to: email,
    subject: 'Reset your password — Inky Cards',
    react: PasswordResetEmail({ name, resetUrl }),
  });
}
