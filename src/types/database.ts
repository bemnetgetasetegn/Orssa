// ORSA Database Types - Auto-generated from schema

export type UserRole = 'super_admin' | 'sub_admin' | 'employee'
export type AccountStatus = 'active' | 'inactive' | 'suspended'
export type ApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'withdrawn'
export type LetterStatus = 'not_created' | 'draft' | 'ready_for_review' | 'issued' | 'superseded'

export interface Profile {
  id: string
  full_name: string
  email: string
  role: UserRole
  account_status: AccountStatus
  must_change_password: boolean
  created_at: string
  updated_at: string
}

export interface JobOffer {
  id: string
  title: string
  slug: string
  description: string | null
  responsibilities: string | null
  default_salary: number | null
  currency: string
  default_work_location: string | null
  default_visa_duration: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Employee {
  id: string
  user_id: string | null
  employee_code: string | null
  full_name: string
  email: string
  passport_number: string
  photo_storage_path: string | null
  registration_date: string
  job_offer_id: string | null
  application_status: ApplicationStatus
  account_status: AccountStatus
  assigned_sub_admin_id: string | null
  phone: string | null
  nationality: string | null
  date_of_birth: string | null
  passport_expiry_date: string | null
  internal_notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  // Relations
  job_offer?: JobOffer | null
  assigned_sub_admin?: Profile | null
}

export interface EmployeeWithRelations extends Employee {
  job_offer: JobOffer | null
  assigned_sub_admin: Profile | null
  application_letter: ApplicationLetter | null
}

export interface SubAdminAssignment {
  id: string
  sub_admin_id: string
  employee_id: string
  assigned_by: string | null
  created_at: string
  // Relations
  sub_admin?: Profile
  employee?: Employee
}

export interface LetterTemplate {
  id: string
  name: string
  job_offer_id: string | null
  content_json: LetterContentJson
  content_html: string | null
  version: number
  is_active: boolean
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
  // Relations
  job_offer?: JobOffer | null
}

export interface LetterContentJson {
  company_name?: string
  company_address?: string
  company_email?: string
  company_phone?: string
  greeting?: string
  introduction?: string
  offer_body?: string
  responsibilities_intro?: string
  responsibilities?: string
  compensation?: string
  visa_info?: string
  accommodation?: string
  food_allowance?: string
  medical?: string
  leave?: string
  career_development?: string
  acceptance_instructions?: string
  closing?: string
  signatory_name?: string
  signatory_title?: string
  footer?: string
  // Dynamic overrides
  salary?: string
  work_location?: string
  visa_duration?: string
  acceptance_deadline?: string
  letter_date?: string
  [key: string]: string | undefined
}

export interface ApplicationLetter {
  id: string
  employee_id: string
  job_offer_id: string | null
  template_id: string | null
  status: LetterStatus
  current_version: number
  letter_date: string | null
  rendered_content: LetterContentJson | null
  created_by: string | null
  updated_by: string | null
  issued_by: string | null
  issued_at: string | null
  created_at: string
  updated_at: string
  // Relations
  employee?: Employee
  job_offer?: JobOffer | null
  template?: LetterTemplate | null
  issued_by_profile?: Profile | null
}

export interface LetterVersion {
  id: string
  application_letter_id: string
  version_number: number
  content_snapshot: LetterContentJson
  pdf_storage_path: string | null
  created_by: string | null
  issued_by: string | null
  issued_at: string | null
  created_at: string
}

export interface AuditLog {
  id: string
  actor_user_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  metadata: Record<string, unknown>
  created_at: string
  // Relations
  actor?: Profile | null
}

export interface Notification {
  id: string
  recipient_user_id: string
  title: string
  message: string
  type: string
  entity_type: string | null
  entity_id: string | null
  read_at: string | null
  created_at: string
}

export interface EmployeeLoginRef {
  id: string
  employee_id: string
  ref_token: string
  is_active: boolean
  created_at: string
}

// ============================================================
// Form Types
// ============================================================

export interface EmployeeRegistrationForm {
  full_name: string
  email: string
  passport_number: string
  registration_date: string
  job_offer_id: string
  account_status: AccountStatus
  phone?: string
  nationality?: string
  date_of_birth?: string
  passport_expiry_date?: string
  internal_notes?: string
  photo?: File
}

export interface SubAdminForm {
  full_name: string
  email: string
  account_status: AccountStatus
  employee_ids?: string[]
}

export interface LetterTemplateForm {
  name: string
  job_offer_id: string
  content_json: LetterContentJson
}

// ============================================================
// API Response Types
// ============================================================

export interface ApiResponse<T = void> {
  data?: T
  error?: string
  success: boolean
}

export interface CredentialResponse {
  employee_name: string
  email: string
  temporary_password: string
  login_url: string
  employee_id: string
  employee_code: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

// ============================================================
// Dashboard Types
// ============================================================

export interface DashboardStats {
  total_employees: number
  newly_registered: number
  active_employees: number
  pending_applications: number
  job_offers_issued: number
  disabled_accounts: number
}

export interface RegistrationTrendPoint {
  date: string
  count: number
}

export interface JobOfferDistribution {
  job_offer: string
  count: number
  percentage: number
}
