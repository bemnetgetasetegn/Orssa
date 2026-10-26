-- ============================================================
-- ORSA RECRUITMENT MANAGEMENT SYSTEM
-- Migration 001: Initial Schema
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('super_admin', 'sub_admin', 'employee');
CREATE TYPE account_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE application_status AS ENUM ('pending', 'under_review', 'approved', 'rejected', 'withdrawn');
CREATE TYPE letter_status AS ENUM ('not_created', 'draft', 'ready_for_review', 'issued', 'superseded');

-- ============================================================
-- PROFILES TABLE
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'employee',
  account_status account_status NOT NULL DEFAULT 'active',
  must_change_password BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX profiles_email_idx ON profiles(email);
CREATE INDEX profiles_role_idx ON profiles(role);

-- ============================================================
-- JOB OFFERS TABLE
-- ============================================================

CREATE TABLE job_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  responsibilities TEXT,
  default_salary NUMERIC(12,2),
  currency TEXT NOT NULL DEFAULT 'USD',
  default_work_location TEXT,
  default_visa_duration TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX job_offers_slug_idx ON job_offers(slug);

-- ============================================================
-- EMPLOYEES TABLE
-- ============================================================

CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  employee_code TEXT UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  passport_number TEXT NOT NULL,
  photo_storage_path TEXT,
  registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
  job_offer_id UUID REFERENCES job_offers(id) ON DELETE SET NULL,
  application_status application_status NOT NULL DEFAULT 'pending',
  account_status account_status NOT NULL DEFAULT 'active',
  assigned_sub_admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  phone TEXT,
  nationality TEXT,
  date_of_birth DATE,
  passport_expiry_date DATE,
  internal_notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX employees_email_idx ON employees(email);
CREATE UNIQUE INDEX employees_passport_idx ON employees(passport_number);
CREATE INDEX employees_job_offer_idx ON employees(job_offer_id);
CREATE INDEX employees_status_idx ON employees(application_status);
CREATE INDEX employees_account_status_idx ON employees(account_status);
CREATE INDEX employees_sub_admin_idx ON employees(assigned_sub_admin_id);
CREATE INDEX employees_registration_date_idx ON employees(registration_date);

-- ============================================================
-- SUB-ADMIN ASSIGNMENTS TABLE
-- ============================================================

CREATE TABLE sub_admin_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(sub_admin_id, employee_id)
);

CREATE INDEX sub_admin_assignments_sub_admin_idx ON sub_admin_assignments(sub_admin_id);
CREATE INDEX sub_admin_assignments_employee_idx ON sub_admin_assignments(employee_id);

-- ============================================================
-- LETTER TEMPLATES TABLE
-- ============================================================

CREATE TABLE letter_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  job_offer_id UUID REFERENCES job_offers(id) ON DELETE SET NULL,
  content_json JSONB NOT NULL DEFAULT '{}',
  content_html TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX letter_templates_job_offer_idx ON letter_templates(job_offer_id);

-- ============================================================
-- APPLICATION LETTERS TABLE
-- ============================================================

CREATE TABLE application_letters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  job_offer_id UUID REFERENCES job_offers(id) ON DELETE SET NULL,
  template_id UUID REFERENCES letter_templates(id) ON DELETE SET NULL,
  status letter_status NOT NULL DEFAULT 'not_created',
  current_version INTEGER NOT NULL DEFAULT 1,
  letter_date DATE,
  rendered_content JSONB,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  issued_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  issued_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX application_letters_employee_idx ON application_letters(employee_id);
CREATE INDEX application_letters_status_idx ON application_letters(status);

-- ============================================================
-- LETTER VERSIONS TABLE
-- ============================================================

CREATE TABLE letter_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_letter_id UUID NOT NULL REFERENCES application_letters(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content_snapshot JSONB NOT NULL,
  pdf_storage_path TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  issued_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  issued_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(application_letter_id, version_number)
);

CREATE INDEX letter_versions_letter_idx ON letter_versions(application_letter_id);

-- ============================================================
-- AUDIT LOGS TABLE
-- ============================================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX audit_logs_actor_idx ON audit_logs(actor_user_id);
CREATE INDEX audit_logs_action_idx ON audit_logs(action);
CREATE INDEX audit_logs_entity_idx ON audit_logs(entity_type, entity_id);
CREATE INDEX audit_logs_created_at_idx ON audit_logs(created_at DESC);

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  entity_type TEXT,
  entity_id UUID,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX notifications_recipient_idx ON notifications(recipient_user_id);
CREATE INDEX notifications_read_idx ON notifications(recipient_user_id, read_at);

-- ============================================================
-- EMPLOYEE LOGIN REFERENCES TABLE
-- ============================================================

CREATE TABLE employee_login_refs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  ref_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX employee_login_refs_token_idx ON employee_login_refs(ref_token);
CREATE INDEX employee_login_refs_employee_idx ON employee_login_refs(employee_id);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER employees_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER job_offers_updated_at BEFORE UPDATE ON job_offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER letter_templates_updated_at BEFORE UPDATE ON letter_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER application_letters_updated_at BEFORE UPDATE ON application_letters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- EMPLOYEE CODE GENERATION
-- ============================================================

CREATE OR REPLACE FUNCTION generate_employee_code()
RETURNS TRIGGER AS $$
DECLARE
  v_code TEXT;
  v_count INTEGER;
BEGIN
  IF NEW.employee_code IS NULL THEN
    LOOP
      v_code := 'EMP-' || LPAD(FLOOR(RANDOM() * 999999 + 1)::TEXT, 6, '0');
      SELECT COUNT(*) INTO v_count FROM employees WHERE employee_code = v_code;
      EXIT WHEN v_count = 0;
    END LOOP;
    NEW.employee_code := v_code;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER employees_generate_code BEFORE INSERT ON employees
  FOR EACH ROW EXECUTE FUNCTION generate_employee_code();
