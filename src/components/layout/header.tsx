'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, Search, ChevronDown, User, Settings, LogOut } from 'lucide-react'
import { HamburgerButton } from '@/components/layout/sidebar'
import type { UserRole } from '@/types/database'
import { logout } from '@/app/actions/auth'
import { cn } from '@/lib/utils'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

interface HeaderProps {
  title: string
  role: UserRole
  fullName: string
  unreadNotifications?: number
  onMenuToggle: () => void
}

export function Header({
  title,
  role,
  fullName,
  unreadNotifications = 0,
  onMenuToggle,
}: HeaderProps) {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const initials = getInitials(fullName)

  // Cmd+K / Ctrl+K shortcut to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      router.push(`/employees?search=${encodeURIComponent(searchValue.trim())}`)
      setSearchValue('')
    }
  }

  return (
    <header
      className="sticky top-0 z-20 flex items-center gap-4 border-b border-[#303036] px-4 py-3 lg:px-6"
      style={{ backgroundColor: '#09090B' }}
    >
      {/* Hamburger (mobile only) */}
      <HamburgerButton onClick={onMenuToggle} />

      {/* Page title */}
      <h1 className="text-base font-semibold text-[#FAFAFA] flex-shrink-0 hidden sm:block">
        {title}
      </h1>

      {/* Global search */}
      <div className="flex-1 max-w-md mx-auto sm:mx-0 sm:ml-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A1A1AA] pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search employees..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full rounded-lg border border-[#303036] bg-[#1D1D20] pl-9 pr-16 py-2 text-sm text-[#FAFAFA] placeholder-[#A1A1AA] outline-none focus:border-[#E50914]/50 focus:ring-1 focus:ring-[#E50914]/30 transition-colors"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-[#303036] bg-[#09090B] px-1 py-0.5 text-[10px] font-medium text-[#A1A1AA]">
              <span>⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Notifications bell */}
        <Link
          href="/notifications"
          className="relative rounded-lg p-2 text-[#A1A1AA] hover:bg-[#1D1D20] hover:text-[#FAFAFA] transition-colors"
        >
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 min-w-[1rem] items-center justify-center rounded-full bg-[#E50914] text-[10px] font-bold text-white px-0.5">
              {unreadNotifications > 99 ? '99+' : unreadNotifications}
            </span>
          )}
        </Link>

        {/* Avatar dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[#1D1D20] transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E50914]/20 text-[#E50914] text-sm font-bold">
              {initials}
            </div>
            <span className="hidden sm:block text-sm font-medium text-[#FAFAFA] max-w-[120px] truncate">
              {fullName}
            </span>
            <ChevronDown
              className={cn(
                'hidden sm:block h-4 w-4 text-[#A1A1AA] transition-transform duration-200',
                dropdownOpen && 'rotate-180',
              )}
            />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-[#303036] shadow-xl z-50 py-1 overflow-hidden"
              style={{ backgroundColor: '#1D1D20' }}
            >
              <div className="px-3 py-2 border-b border-[#303036] mb-1">
                <p className="text-xs font-semibold text-[#FAFAFA] truncate">{fullName}</p>
                <p className="text-[11px] text-[#A1A1AA] capitalize">{role.replace('_', ' ')}</p>
              </div>

              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[#A1A1AA] hover:bg-[#303036]/40 hover:text-[#FAFAFA] transition-colors"
              >
                <User className="h-4 w-4" />
                View Profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[#A1A1AA] hover:bg-[#303036]/40 hover:text-[#FAFAFA] transition-colors"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>

              <div className="border-t border-[#303036] mt-1 pt-1">
                <form action={logout}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#E50914] hover:bg-[#E50914]/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
