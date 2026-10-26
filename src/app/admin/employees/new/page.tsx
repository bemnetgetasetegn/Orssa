import { requireAdmin } from '@/lib/auth/helpers'
import { createClient } from '@/lib/supabase/server'
import { AdminLayout } from '@/components/layout/admin-layout'
import NewEmployeeClient from './NewEmployeeClient'
import type { JobOffer } from '@/types/database'

export const dynamic = 'force-dynamic'

export default async function NewEmployeePage() {
  const profile = await requireAdmin()
  const supabase = await createClient()

  // Fetch active job offers
  const { data: jobOffers } = await supabase
    .from('job_offers')
    .select('*')
    .eq('is_active', true)
    .order('title', { ascending: true })

  return (
    <AdminLayout title="Register Employee">
      <NewEmployeeClient
        jobOffers={(jobOffers as JobOffer[]) || []}
        isSuperAdmin={profile.role === 'super_admin'}
      />
    </AdminLayout>
  )
}
