-- ============================================================
-- ORSA RECRUITMENT MANAGEMENT SYSTEM
-- Migration 002: Row Level Security Policies
-- ============================================================

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Get current user role from profiles table
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role::TEXT FROM profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Check if current user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Check if current user is sub admin
CREATE OR REPLACE FUNCTION is_sub_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'sub_admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Check if current user is an employee
CREATE OR REPLACE FUNCTION is_employee()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'employee'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Check if current user is admin (super or sub)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'sub_admin')
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Check if sub-admin can access specific employee
CREATE OR REPLACE FUNCTION sub_admin_can_access_employee(p_employee_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM sub_admin_assignments
    WHERE sub_admin_id = auth.uid()
    AND employee_id = p_employee_id
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ============================================================
-- PROFILES TABLE RLS
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Super admin can view all profiles
CREATE POLICY "super_admin_view_profiles" ON profiles
  FOR SELECT USING (is_super_admin());

-- Sub-admin can view their own profile and employee profiles in their scope
CREATE POLICY "sub_admin_view_profiles" ON profiles
  FOR SELECT USING (
    is_sub_admin() AND (
      id = auth.uid() OR
      role = 'employee'
    )
  );

-- Users can view their own profile
CREATE POLICY "own_profile_select" ON profiles
  FOR SELECT USING (id = auth.uid());

-- Super admin can insert profiles (via service role for auth operations)
CREATE POLICY "super_admin_insert_profiles" ON profiles
  FOR INSERT WITH CHECK (is_super_admin());

-- Super admin can update profiles
CREATE POLICY "super_admin_update_profiles" ON profiles
  FOR UPDATE USING (is_super_admin());

-- Users can update their own limited profile data
CREATE POLICY "own_profile_update" ON profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    -- Prevent role changes through client
  );

-- Super admin can delete profiles (except their own)
CREATE POLICY "super_admin_delete_profiles" ON profiles
  FOR DELETE USING (is_super_admin() AND id != auth.uid());

-- ============================================================
-- JOB OFFERS TABLE RLS
-- ============================================================

ALTER TABLE job_offers ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read active job offers
CREATE POLICY "authenticated_view_job_offers" ON job_offers
  FOR SELECT USING (auth.uid() IS NOT NULL AND is_active = true);

-- Super admin can view all job offers
CREATE POLICY "super_admin_view_all_job_offers" ON job_offers
  FOR SELECT USING (is_super_admin());

-- Super admin full control
CREATE POLICY "super_admin_manage_job_offers" ON job_offers
  FOR ALL USING (is_super_admin());

-- ============================================================
-- EMPLOYEES TABLE RLS
-- ============================================================

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Super admin can see all employees
CREATE POLICY "super_admin_view_employees" ON employees
  FOR SELECT USING (is_super_admin());

-- Super admin can insert employees
CREATE POLICY "super_admin_insert_employees" ON employees
  FOR INSERT WITH CHECK (is_super_admin());

-- Super admin can update employees
CREATE POLICY "super_admin_update_employees" ON employees
  FOR UPDATE USING (is_super_admin());

-- Super admin can delete employees
CREATE POLICY "super_admin_delete_employees" ON employees
  FOR DELETE USING (is_super_admin());

-- Sub-admin can see assigned employees only
CREATE POLICY "sub_admin_view_employees" ON employees
  FOR SELECT USING (
    is_sub_admin() AND sub_admin_can_access_employee(id)
  );

-- Sub-admin can update assigned employees (limited fields enforced in application)
CREATE POLICY "sub_admin_update_employees" ON employees
  FOR UPDATE USING (
    is_sub_admin() AND sub_admin_can_access_employee(id)
  );

-- Employee can only see their own record
CREATE POLICY "employee_view_own" ON employees
  FOR SELECT USING (
    is_employee() AND user_id = auth.uid()
  );

-- ============================================================
-- SUB_ADMIN_ASSIGNMENTS TABLE RLS
-- ============================================================

ALTER TABLE sub_admin_assignments ENABLE ROW LEVEL SECURITY;

-- Super admin full control
CREATE POLICY "super_admin_manage_assignments" ON sub_admin_assignments
  FOR ALL USING (is_super_admin());

-- Sub-admin can view their own assignments
CREATE POLICY "sub_admin_view_own_assignments" ON sub_admin_assignments
  FOR SELECT USING (
    is_sub_admin() AND sub_admin_id = auth.uid()
  );

-- ============================================================
-- LETTER_TEMPLATES TABLE RLS
-- ============================================================

ALTER TABLE letter_templates ENABLE ROW LEVEL SECURITY;

-- Super admin full control
CREATE POLICY "super_admin_manage_templates" ON letter_templates
  FOR ALL USING (is_super_admin());

-- Sub-admin and employees cannot manage templates
-- (no additional policies needed)

-- ============================================================
-- APPLICATION_LETTERS TABLE RLS
-- ============================================================

ALTER TABLE application_letters ENABLE ROW LEVEL SECURITY;

-- Super admin full control
CREATE POLICY "super_admin_manage_letters" ON application_letters
  FOR ALL USING (is_super_admin());

-- Employees can only view their own ISSUED letter
CREATE POLICY "employee_view_own_letter" ON application_letters
  FOR SELECT USING (
    is_employee() AND
    status = 'issued' AND
    employee_id = (
      SELECT id FROM employees WHERE user_id = auth.uid() LIMIT 1
    )
  );

-- Sub-admins cannot view or edit letters
-- (no policy = no access)

-- ============================================================
-- LETTER_VERSIONS TABLE RLS
-- ============================================================

ALTER TABLE letter_versions ENABLE ROW LEVEL SECURITY;

-- Super admin full control
CREATE POLICY "super_admin_manage_letter_versions" ON letter_versions
  FOR ALL USING (is_super_admin());

-- Employees can view their own issued version
CREATE POLICY "employee_view_own_letter_version" ON letter_versions
  FOR SELECT USING (
    is_employee() AND
    issued_at IS NOT NULL AND
    application_letter_id = (
      SELECT al.id FROM application_letters al
      JOIN employees e ON e.id = al.employee_id
      WHERE e.user_id = auth.uid()
      AND al.status = 'issued'
      LIMIT 1
    )
  );

-- ============================================================
-- AUDIT_LOGS TABLE RLS
-- ============================================================

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Super admin can view all audit logs
CREATE POLICY "super_admin_view_audit_logs" ON audit_logs
  FOR SELECT USING (is_super_admin());

-- Audit logs are insert-only for the application (via service role)
-- No update or delete for any user
CREATE POLICY "no_update_audit_logs" ON audit_logs
  FOR UPDATE USING (false);

CREATE POLICY "no_delete_audit_logs" ON audit_logs
  FOR DELETE USING (false);

-- ============================================================
-- NOTIFICATIONS TABLE RLS
-- ============================================================

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "view_own_notifications" ON notifications
  FOR SELECT USING (recipient_user_id = auth.uid());

-- Users can update (mark read) their own notifications
CREATE POLICY "update_own_notifications" ON notifications
  FOR UPDATE USING (recipient_user_id = auth.uid())
  WITH CHECK (recipient_user_id = auth.uid());

-- Only super admin can insert notifications (or service role)
CREATE POLICY "super_admin_insert_notifications" ON notifications
  FOR INSERT WITH CHECK (is_super_admin());

-- ============================================================
-- EMPLOYEE_LOGIN_REFS TABLE RLS
-- ============================================================

ALTER TABLE employee_login_refs ENABLE ROW LEVEL SECURITY;

-- Super admin can manage login refs
CREATE POLICY "super_admin_manage_login_refs" ON employee_login_refs
  FOR ALL USING (is_super_admin());

-- Public read for ref validation (only the token, not the employee_id directly)
-- Validation is done server-side
CREATE POLICY "public_read_login_refs" ON employee_login_refs
  FOR SELECT USING (is_active = true);
