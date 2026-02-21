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

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type SignInFormData = z.infer<typeof signInSchema>;

export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const addressSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string(),
  zip: z.string().min(1, 'Postcode is required'),
  country: z.string().min(1, 'Country is required'),
  isDefault: z.boolean(),
});

export type AddressFormData = z.infer<typeof addressSchema>;

export function validateTextLength(text: string, maxLength: number): boolean {
  return text.length <= maxLength;
}

export function containsProfanity(text: string): boolean {
  const profanityList = ['badword1', 'badword2']; // Basic list for demo
  const lowerText = text.toLowerCase();
  return profanityList.some((word) => lowerText.includes(word));
}
