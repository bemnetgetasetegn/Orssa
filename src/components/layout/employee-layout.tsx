import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EmployeeLayoutClient from './employee-layout-client'

export async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, account_status')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'employee') {
    redirect('/login')
  }

  if (profile.account_status === 'suspended') {
    redirect('/login?error=account_suspended')
  }

  const { data: employee } = await supabase
    .from('employees')
    .select('employee_code')
    .eq('user_id', user.id)
    .single()

  return (
    <EmployeeLayoutClient
      fullName={profile.full_name}
      employeeCode={employee?.employee_code || undefined}
    >
      {children}
    </EmployeeLayoutClient>
  )
}
