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
      job_offer:job_offers(id, title)
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
        issued_at
      `)
      .eq('employee_id', employee.id)
      .eq('status', 'issued')
      .single()

    if (letterData) {
      letter = {
        ...letterData,
        employee,
        job_offer: employee.job_offer,
      }
    }
  }

  return (
    <EmployeeLayout>
      <EmployeeLetterClient letter={letter as any} />
    </EmployeeLayout>
  )
}
