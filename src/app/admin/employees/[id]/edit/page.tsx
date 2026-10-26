import { notFound } from 'next/navigation'
import { requireAdmin, canManageEmployee } from '@/lib/auth/helpers'
import { getEmployee } from '@/app/actions/employees'
import { createClient } from '@/lib/supabase/server'
import { AdminLayout } from '@/components/layout/admin-layout'
import EditEmployeeClient from './EditEmployeeClient'
import type { JobOffer } from '@/types/database'

export const dynamic = 'force-dynamic'

interface EditEmployeePageProps {
  params: Promise<{ id: string }>
}

export default async function EditEmployeePage({ params }: EditEmployeePageProps) {
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

  const supabase = await createClient()
  const { data: jobOffers } = await supabase
    .from('job_offers')
    .select('*')
    .eq('is_active', true)
    .order('title', { ascending: true })

  return (
    <AdminLayout title="Edit Employee">
      <EditEmployeeClient
        employee={empRes.data as any}
        jobOffers={(jobOffers as JobOffer[]) || []}
        isSuperAdmin={profile.role === 'super_admin'}
      />
    </AdminLayout>
  )
}
