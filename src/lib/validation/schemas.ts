import { z } from 'zod'

// ============================================================
// Employee Registration Schema
// ============================================================

export const employeeRegistrationSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be at most 100 characters')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  passport_number: z
    .string()
    .min(3, 'Passport number is required')
    .max(20, 'Passport number is too long')
    .trim()
    .toUpperCase(),
  registration_date: z
    .string()
    .min(1, 'Registration date is required'),
  job_offer_id: z
    .string()
    .uuid('Please select a valid job offer')
    .optional()
    .nullable()
    .or(z.literal('')),
  account_status: z.enum(['active', 'inactive', 'suspended']).default('active'),
  phone: z
    .string()
    .max(20, 'Phone number is too long')
    .optional()
    .or(z.literal('')),
  nationality: z
    .string()
    .max(50, 'Nationality is too long')
    .optional()
    .or(z.literal('')),
  date_of_birth: z
    .string()
    .optional()
    .or(z.literal('')),
  passport_expiry_date: z
    .string()
    .optional()
    .or(z.literal('')),
  internal_notes: z
    .string()
    .max(1000, 'Notes must be at most 1000 characters')
    .optional()
    .or(z.literal('')),
})

export type EmployeeRegistrationInput = z.infer<typeof employeeRegistrationSchema>

// ============================================================
// Employee Edit Schema
// ============================================================

export const employeeEditSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be at most 100 characters')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  passport_number: z
    .string()
    .min(3, 'Passport number is required')
    .max(20, 'Passport number is too long')
    .trim()
    .toUpperCase(),
  registration_date: z
    .string()
    .min(1, 'Registration date is required'),
  job_offer_id: z
    .string()
    .uuid('Please select a valid job offer')
    .optional()
    .nullable(),
  application_status: z.enum(['pending', 'under_review', 'approved', 'rejected', 'withdrawn']),
  account_status: z.enum(['active', 'inactive', 'suspended']),
  phone: z
    .string()
    .max(20, 'Phone number is too long')
    .optional()
    .or(z.literal('')),
  nationality: z
    .string()
    .max(50, 'Nationality is too long')
    .optional()
    .or(z.literal('')),
  date_of_birth: z
    .string()
    .optional()
    .or(z.literal('')),
  passport_expiry_date: z
    .string()
    .optional()
    .or(z.literal('')),
  internal_notes: z
    .string()
    .max(1000, 'Notes must be at most 1000 characters')
    .optional()
    .or(z.literal('')),
})

export type EmployeeEditInput = z.infer<typeof employeeEditSchema>

// ============================================================
// Sub-Admin Form Schema
// ============================================================

export const subAdminSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be at most 100 characters')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  account_status: z.enum(['active', 'inactive', 'suspended']).default('active'),
})

export type SubAdminInput = z.infer<typeof subAdminSchema>

// ============================================================
// Login Schema
// ============================================================

export const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof loginSchema>

// ============================================================
// Password Change Schema
// ============================================================

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>

// ============================================================
// Letter Template Schema
// ============================================================

export const letterTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(100),
  job_offer_id: z.string().uuid('Please select a job offer').optional().nullable(),
  content_json: z.object({
    company_name: z.string().optional(),
    company_address: z.string().optional(),
    company_email: z.string().optional(),
    company_phone: z.string().optional(),
    greeting: z.string().optional(),
    introduction: z.string().optional(),
    offer_body: z.string().optional(),
    responsibilities_intro: z.string().optional(),
    responsibilities: z.string().optional(),
    compensation: z.string().optional(),
    visa_info: z.string().optional(),
    accommodation: z.string().optional(),
    food_allowance: z.string().optional(),
    medical: z.string().optional(),
    leave: z.string().optional(),
    career_development: z.string().optional(),
    acceptance_instructions: z.string().optional(),
    closing: z.string().optional(),
    signatory_name: z.string().optional(),
    signatory_title: z.string().optional(),
    footer: z.string().optional(),
  }),
})

export type LetterTemplateInput = z.infer<typeof letterTemplateSchema>

// ============================================================
// Application Letter Edit Schema
// ============================================================

export const applicationLetterSchema = z.object({
  template_id: z.string().uuid().optional().nullable(),
  letter_date: z.string().optional().nullable(),
  rendered_content: z.object({}).passthrough().optional().nullable(),
  status: z.enum(['not_created', 'draft', 'ready_for_review', 'issued', 'superseded']).optional(),
})

export type ApplicationLetterInput = z.infer<typeof applicationLetterSchema>

// ============================================================
// Photo Upload Validation
// ============================================================

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
export const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export function validatePhotoFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'Photo must be a JPG, JPEG, PNG, or WebP file'
  }
  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    return 'Photo must be smaller than 5MB'
  }
  return null
}
