import { z } from "zod";

// Indian GSTIN format: 2 digits state code + 10 alphanumeric PAN + 1 digit entity number + 1 letter (Z) + 1 check digit
export const gstinSchema = z.string()
  .regex(
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    "Invalid GSTIN format (e.g., 29ABCDE1234F1Z5)"
  );

export const buyerSchema = z.object({
  gstin: gstinSchema,
  name: z.string().trim().min(1, "Name is required").max(200, "Name too long"),
  address: z.string().trim().min(1, "Address is required").max(500, "Address too long"),
  state: z.string().trim().min(1, "State is required").max(100),
  stateCode: z.string().trim().length(2, "State code must be 2 digits"),
  contact: z.string().trim().max(20, "Contact too long").optional(),
  email: z.string().trim().email("Invalid email").max(255, "Email too long").optional(),
});

export const sellerSchema = z.object({
  company_name: z.string().trim().min(1, "Company name is required").max(200, "Company name too long"),
  address: z.string().trim().min(1, "Address is required").max(500, "Address too long"),
  gstin: gstinSchema,
  contact: z.string().trim().max(20, "Contact too long").optional(),
  email: z.string().trim().email("Invalid email").max(255, "Email too long").optional(),
  state: z.string().trim().min(1, "State is required").max(100),
  state_code: z.string().trim().length(2, "State code must be 2 digits"),
});

export const bankDetailsSchema = z.object({
  bank_name: z.string().trim().min(1, "Bank name is required").max(200, "Bank name too long"),
  account_no: z.string().trim().min(1, "Account number is required").max(50, "Account number too long"),
  ifsc_code: z.string()
    .trim()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format")
    .length(11, "IFSC code must be 11 characters"),
  branch_name: z.string().trim().min(1, "Branch name is required").max(200, "Branch name too long"),
});

export const invoiceItemSchema = z.object({
  description: z.string().trim().min(1, "Description is required").max(500, "Description too long"),
  hsnSac: z.string().trim().max(20, "HSN/SAC too long"),
  quantity: z.number().positive("Quantity must be positive").max(999999, "Quantity too large"),
  rate: z.number().positive("Rate must be positive").max(9999999999, "Rate too large"),
  amount: z.number().nonnegative("Amount cannot be negative").max(9999999999, "Amount too large"),
  discount: z.number().min(0, "Discount cannot be negative").max(100, "Discount cannot exceed 100%").optional(),
});

export type BuyerFormData = z.infer<typeof buyerSchema>;
export type SellerFormData = z.infer<typeof sellerSchema>;
export type BankDetailsFormData = z.infer<typeof bankDetailsSchema>;
export type InvoiceItemFormData = z.infer<typeof invoiceItemSchema>;