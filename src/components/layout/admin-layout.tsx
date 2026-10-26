import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminLayoutClient } from '@/components/layout/admin-layout-client'
import type { UserRole } from '@/types/database'

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
}

/**
 * Server component that reads the authenticated profile from Supabase
 * and wraps all admin pages with the sidebar + header shell.
 */
export async function AdminLayout({ children, title }: AdminLayoutProps) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, account_status')
    .eq('id', session.user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  if (profile.account_status === 'suspended') {
    redirect('/suspended')
  }

  // Fetch unread notification count
  const { count: unreadCount } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('recipient_user_id', session.user.id)
    .is('read_at', null)

  return (
    <AdminLayoutClient
      title={title}
      role={profile.role as UserRole}
      fullName={profile.full_name}
      unreadNotifications={unreadCount ?? 0}
    >
      {children}
    </AdminLayoutClient>
  )
}
