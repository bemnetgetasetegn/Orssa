import { requireEmployee } from '@/lib/auth/helpers'
import { EmployeeLayout } from '@/components/layout/employee-layout'
import EmployeeSecurityClient from './EmployeeSecurityClient'

export const dynamic = 'force-dynamic'

export default async function EmployeeSecurityPage() {
  const profile = await requireEmployee()

  return (
    <EmployeeLayout>
      <EmployeeSecurityClient mustChange={profile.must_change_password} />
    </EmployeeLayout>
  )
}
