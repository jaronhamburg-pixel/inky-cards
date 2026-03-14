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
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
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

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// ─── Saved Designs ───────────────────────────────────────

export const savedDesignSchema = z.object({
  cardId: z.string().min(1, 'Card ID is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  customization: z.object({
    frontText: z.string().optional(),
    backText: z.string().optional(),
    insideText: z.string().optional(),
    fontFamily: z.string().optional(),
    fontSize: z.number().optional(),
    textColor: z.string().optional(),
  }),
});

export type SavedDesignFormData = z.infer<typeof savedDesignSchema>;

export const savedDesignUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less').optional(),
  customization: z.object({
    frontText: z.string().optional(),
    backText: z.string().optional(),
    insideText: z.string().optional(),
    fontFamily: z.string().optional(),
    fontSize: z.number().optional(),
    textColor: z.string().optional(),
  }).optional(),
});

export type SavedDesignUpdateFormData = z.infer<typeof savedDesignUpdateSchema>;

// ─── Reviews ─────────────────────────────────────────────

export const reviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  content: z.string().min(1, 'Review is required').max(2000, 'Review must be 2000 characters or less'),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

export const reviewUpdateSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(2000).optional(),
});

export type ReviewUpdateFormData = z.infer<typeof reviewUpdateSchema>;

// ─── Helpers ─────────────────────────────────────────────

export function validateTextLength(text: string, maxLength: number): boolean {
  return text.length <= maxLength;
}

export function containsProfanity(text: string): boolean {
  const profanityList = ['badword1', 'badword2']; // Basic list for demo
  const lowerText = text.toLowerCase();
  return profanityList.some((word) => lowerText.includes(word));
}
