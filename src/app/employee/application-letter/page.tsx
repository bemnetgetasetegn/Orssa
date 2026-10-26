import { requireEmployee } from '@/lib/auth/helpers'
import { createClient } from '@/lib/supabase/server'
import { EmployeeLayout } from '@/components/layout/employee-layout'
import EmployeeLetterClient from './EmployeeLetterClient'

export const dynamic = 'force-dynamic'

export default async function EmployeeApplicationLetterPage() {
  const profile = await requireEmployee()
  const supabase = await createClient()

  // Enforce RLS / server check: only own issued letter
  const { data: employee } = await supabase
    .from('employees')
    .select(`
      id,
      full_name,
      passport_number,
      job_offer_id,
      job_offer:job_offers(id, title, default_work_location)
    `)
    .eq('user_id', profile.id)
    .single()

  let letter = null
  if (employee) {
    const { data: letterData } = await supabase
      .from('application_letters')
      .select(`
        id,
        status,
        current_version,
        letter_date,
        rendered_content,
        issued_at,
        job_offer_id
      `)
      .eq('employee_id', employee.id)
      .eq('status', 'issued')
      .single()

    if (letterData) {
      let resolvedJobOffer: any = employee.job_offer
      const targetJobOfferId = letterData.job_offer_id || employee.job_offer_id

      if (!resolvedJobOffer && targetJobOfferId) {
        const { data: directJobOffer } = await supabase
          .from('job_offers')
          .select('id, title, default_work_location')
          .eq('id', targetJobOfferId)
          .maybeSingle()

        if (directJobOffer) {
          resolvedJobOffer = directJobOffer
        }
      }

      letter = {
        ...letterData,
        employee,
        job_offer: resolvedJobOffer as any,
      }
    }
  }

  return (
    <EmployeeLayout>
      <EmployeeLetterClient letter={letter as any} />
    </EmployeeLayout>
  )
}
