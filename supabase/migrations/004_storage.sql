-- ============================================================
-- ORSA RECRUITMENT MANAGEMENT SYSTEM
-- Migration 004: Storage Buckets Configuration
-- (Run these in Supabase Storage dashboard or via API)
-- ============================================================

-- Note: Storage bucket creation via SQL is done through the
-- storage schema. Run the following in the Supabase SQL editor.

-- Create private employee photos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'employee-photos',
  'employee-photos',
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create private employee documents bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'employee-documents',
  'employee-documents',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STORAGE RLS POLICIES
-- ============================================================

-- Employee photos: super admin and sub-admin can upload/view
CREATE POLICY "admin_manage_photos" ON storage.objects
  FOR ALL USING (
    bucket_id = 'employee-photos' AND
    (is_super_admin() OR is_sub_admin())
  );

-- Employees can view their own photo
CREATE POLICY "employee_view_own_photo" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'employee-photos' AND
    is_employee() AND
    name LIKE (
      SELECT 'employees/' || e.id::text || '/%'
      FROM employees e
      WHERE e.user_id = auth.uid()
      LIMIT 1
    )
  );

-- Employee documents: super admin full access
CREATE POLICY "super_admin_manage_documents" ON storage.objects
  FOR ALL USING (
    bucket_id = 'employee-documents' AND
    is_super_admin()
  );

-- Employees can read their own issued document
CREATE POLICY "employee_read_own_document" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'employee-documents' AND
    is_employee() AND
    name LIKE (
      SELECT 'letters/' || e.id::text || '/%'
      FROM employees e
      WHERE e.user_id = auth.uid()
      LIMIT 1
    )
  );
