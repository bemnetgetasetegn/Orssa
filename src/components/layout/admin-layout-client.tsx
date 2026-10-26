'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar, MobileSidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import type { UserRole } from '@/types/database'

interface AdminLayoutClientProps {
  children: React.ReactNode
  title: string
  role: UserRole
  fullName: string
  unreadNotifications?: number
}

export function AdminLayoutClient({
  children,
  title,
  role,
  fullName,
  unreadNotifications = 0,
}: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#09090B' }}>
      {/* Desktop sidebar */}
      <Sidebar role={role} fullName={fullName} currentPath={pathname} />

      {/* Mobile sidebar drawer */}
      <MobileSidebar
        role={role}
        fullName={fullName}
        currentPath={pathname}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area — offset by sidebar on desktop */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header
          title={title}
          role={role}
          fullName={fullName}
          unreadNotifications={unreadNotifications}
          onMenuToggle={() => setSidebarOpen(true)}
        />

        <main className="flex-1 px-4 py-6 lg:px-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
