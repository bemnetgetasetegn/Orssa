import { requireSuperAdmin } from '@/lib/auth/helpers'
import { getLetterTemplates } from '@/app/actions/letters'
import { createClient } from '@/lib/supabase/server'
import { AdminLayout } from '@/components/layout/admin-layout'
import TemplatesClient from './TemplatesClient'
import type { JobOffer } from '@/types/database'

export const dynamic = 'force-dynamic'

export default async function TemplatesPage() {
  await requireSuperAdmin()
  const templatesRes = await getLetterTemplates()

  const supabase = await createClient()
  const { data: jobOffers } = await supabase
    .from('job_offers')
    .select('*')
    .eq('is_active', true)
    .order('title', { ascending: true })

  return (
    <AdminLayout title="Letter Templates">
      <TemplatesClient
        templates={templatesRes.data || []}
        jobOffers={(jobOffers as JobOffer[]) || []}
      />
    </AdminLayout>
  )
}
