'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  User,
  FileText,
  Shield,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { logout } from '@/app/actions/auth'

interface EmployeeLayoutClientProps {
  children: React.ReactNode
  fullName: string
  employeeCode?: string
}

export default function EmployeeLayoutClient({
  children,
  fullName,
  employeeCode,
}: EmployeeLayoutClientProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/employee', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/employee/profile', label: 'My Profile', icon: User },
    { href: '/employee/application-letter', label: 'Offer Letter', icon: FileText },
    { href: '/employee/security', label: 'Security & Password', icon: Shield },
  ]

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#141416] border-b border-[#303036]">
        <div className="flex items-center gap-2">
          <span className="font-extrabold tracking-wider text-[#E50914] text-lg">ORSA</span>
          <span className="text-xs text-[#A1A1AA] uppercase tracking-wider">Candidate Portal</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 rounded text-[#A1A1AA]"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#141416] border-r border-[#303036] flex flex-col justify-between transform transition-transform md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:relative'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <span className="font-extrabold tracking-wider text-[#E50914] text-xl">ORSA</span>
            <div className="border-l border-[#303036] pl-2">
              <p className="text-[10px] uppercase font-bold text-[#FAFAFA] tracking-wider leading-none">
                Candidate
              </p>
              <p className="text-[9px] text-[#A1A1AA] leading-none mt-0.5">Portal</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-[#1D1D20] text-[#E50914] border-l-2 border-[#E50914]'
                      : 'text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#1D1D20]/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-[#303036]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#E50914]/20 border border-[#E50914] flex items-center justify-center font-bold text-xs text-[#E50914]">
              {fullName.slice(0, 2).toUpperCase()}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-semibold text-[#FAFAFA] truncate">{fullName}</p>
              <p className="text-[10px] font-mono text-[#A1A1AA]">{employeeCode || 'Candidate'}</p>
            </div>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#1D1D20] hover:bg-[#27272A] border border-[#303036] text-xs font-semibold text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto w-full">{children}</main>
    </div>
  )
}
