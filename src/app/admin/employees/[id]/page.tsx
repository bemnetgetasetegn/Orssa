import { notFound } from 'next/navigation'
import { requireAdmin, canManageEmployee } from '@/lib/auth/helpers'
import { getEmployee, getEmployeePhotoUrl } from '@/app/actions/employees'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { AdminLayout } from '@/components/layout/admin-layout'
import { getBaseUrl } from '@/lib/utils/url'
import EmployeeDetailClient from './EmployeeDetailClient'
import type { AuditLog } from '@/types/database'

export const dynamic = 'force-dynamic'

interface EmployeePageProps {
  params: Promise<{ id: string }>
}

export default async function EmployeeDetailPage({ params }: EmployeePageProps) {
  const profile = await requireAdmin()
  const { id } = await params

  const canManage = await canManageEmployee(id)
  if (!canManage) {
    notFound()
  }

  const empRes = await getEmployee(id)
  if (!empRes.success || !empRes.data) {
    notFound()
  }

  const employee = empRes.data
  let photoUrl: string | null = null

  if (employee.photo_storage_path) {
    const photoRes = await getEmployeePhotoUrl(employee.photo_storage_path)
    if (photoRes.success && photoRes.data) {
      photoUrl = typeof photoRes.data === 'string' ? photoRes.data : (photoRes.data as any).signed_url
    }
  }

  // Fetch recent audit logs for this employee
  const supabase = await createClient()
  const { data: auditLogs } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('entity_id', id)
    .order('created_at', { ascending: false })
    .limit(20)

  const baseUrl = await getBaseUrl()

  // Fetch active login ref for direct portal access link
  const adminClient = createAdminClient()
  const { data: loginRefRecord } = await adminClient
    .from('employee_login_refs')
    .select('ref_token')
    .eq('employee_id', id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const loginRef = loginRefRecord?.ref_token || null

  return (
    <AdminLayout title="Employee Profile">
      <EmployeeDetailClient
        employee={employee as any}
        photoUrl={photoUrl}
        auditLogs={(auditLogs as AuditLog[]) || []}
        isSuperAdmin={profile.role === 'super_admin'}
        baseUrl={baseUrl}
        loginRef={loginRef}
      />
    </AdminLayout>
  )
}
