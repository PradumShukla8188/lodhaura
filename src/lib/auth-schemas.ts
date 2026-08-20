import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().refine((val) => !val || isValidPhoneNumber(val), "Invalid phone number").optional(),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
});

export const complaintSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(1, "Phone number is required").refine(isValidPhoneNumber, "Invalid phone number"),
  category: z.string().min(1, "Select a category"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(20, "Please describe your complaint in detail"),
});

export const suggestionSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  topic: z.string().min(3, "Topic is required"),
  suggestion: z.string().min(20, "Please share your suggestion in detail"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().refine((val) => !val || isValidPhoneNumber(val), "Invalid phone number").optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const investorContactSchema = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  organization: z.string().optional(),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(1, "Phone number is required").refine(isValidPhoneNumber, "Invalid phone number"),
  investmentType: z.string().min(1, "Please select an investment type"),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  message: z.string().min(20, "Please describe your proposal in detail"),
});

export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ComplaintFormData = z.infer<typeof complaintSchema>;
export type SuggestionFormData = z.infer<typeof suggestionSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type InvestorContactFormData = z.infer<typeof investorContactSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;
