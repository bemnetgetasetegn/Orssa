import { requireSuperAdmin } from '@/lib/auth/helpers'
import { getSubAdmins } from '@/app/actions/sub-admins'
import { createClient } from '@/lib/supabase/server'
import { AdminLayout } from '@/components/layout/admin-layout'
import SubAdminsClient from './SubAdminsClient'
import type { Employee } from '@/types/database'

export const dynamic = 'force-dynamic'

export default async function SubAdminsPage() {
  await requireSuperAdmin()
  const subAdminsRes = await getSubAdmins()

  const supabase = await createClient()
  const { data: allEmployees } = await supabase
    .from('employees')
    .select('id, full_name, email, passport_number, assigned_sub_admin_id')
    .order('full_name', { ascending: true })

  return (
    <AdminLayout title="Sub-Administrators">
      <SubAdminsClient
        subAdmins={subAdminsRes.data || []}
        allEmployees={(allEmployees as Employee[]) || []}
      />
    </AdminLayout>
  )
}
