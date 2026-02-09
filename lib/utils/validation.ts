import { z } from 'zod';

export const customerInfoSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
});

export const shippingInfoSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().min(5, 'ZIP code must be at least 5 characters'),
  country: z.string(),
});

export const checkoutSchema = customerInfoSchema.merge(shippingInfoSchema);

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function validateTextLength(text: string, maxLength: number): boolean {
  return text.length <= maxLength;
}

export function containsProfanity(text: string): boolean {
  const profanityList = ['badword1', 'badword2']; // Basic list for demo
  const lowerText = text.toLowerCase();
  return profanityList.some((word) => lowerText.includes(word));
}
