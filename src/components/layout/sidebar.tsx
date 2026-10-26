'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  UserPlus,
  UserCog,
  FileText,
  BarChart3,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/app/actions/auth'
import type { UserRole } from '@/types/database'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  roles?: UserRole[]
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/employees',
    label: 'Employees',
    icon: Users,
  },
  {
    href: '/admin/employees/new',
    label: 'Add Employee',
    icon: UserPlus,
  },
  {
    href: '/admin/sub-admins',
    label: 'Sub-Admins',
    icon: UserCog,
    roles: ['super_admin'],
  },
  {
    href: '/admin/letters',
    label: 'Employment Letters',
    icon: FileText,
  },
  {
    href: '/admin/reports',
    label: 'Reports',
    icon: BarChart3,
    roles: ['super_admin'],
  },
  {
    href: '/admin/audit-logs',
    label: 'Audit Logs',
    icon: ClipboardList,
    roles: ['super_admin'],
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: Settings,
    roles: ['super_admin'],
  },
]

interface SidebarProps {
  role: UserRole
  fullName: string
  currentPath?: string
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'super_admin':
      return 'Super Admin'
    case 'sub_admin':
      return 'Sub-Admin'
    case 'employee':
      return 'Employee'
  }
}

interface NavLinkProps {
  item: NavItem
  currentPath: string
  onClick?: () => void
}

function NavLink({ item, currentPath, onClick }: NavLinkProps) {
  const isActive =
    currentPath === item.href ||
    (item.href !== '/dashboard' && currentPath.startsWith(item.href))

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
        isActive
          ? 'border-l-2 border-[#E50914] bg-[#E50914]/10 pl-[10px] text-[#E50914]'
          : 'border-l-2 border-transparent text-[#A1A1AA] hover:bg-[#303036]/30 hover:text-[#FAFAFA]',
      )}
    >
      <item.icon
        className={cn(
          'h-4 w-4 flex-shrink-0 transition-colors',
          isActive ? 'text-[#E50914]' : 'text-[#A1A1AA] group-hover:text-[#FAFAFA]',
        )}
      />
      <span className="truncate">{item.label}</span>
      {isActive && (
        <ChevronRight className="ml-auto h-3 w-3 flex-shrink-0 text-[#E50914]" />
      )}
    </Link>
  )
}

// ─── Desktop Sidebar ─────────────────────────────────────────────────────────

export function Sidebar({ role, fullName, currentPath = '/admin' }: SidebarProps) {
  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(role),
  )
  const initials = getInitials(fullName)
  const roleLabel = getRoleLabel(role)

  return (
    <aside
      className="hidden lg:flex flex-col w-64 fixed top-0 left-0 h-full border-r border-[#303036] z-30"
      style={{ backgroundColor: '#141416' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-[#303036]">
        <div className="flex flex-col leading-tight">
          <span className="text-2xl font-extrabold tracking-widest text-[#E50914]">
            ORSA
          </span>
          <span className="text-[10px] font-medium tracking-[0.2em] text-[#A1A1AA] uppercase">
            Recruitment
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {visibleItems.map((item) => (
          <NavLink key={item.href} item={item} currentPath={currentPath} />
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-3 border-t border-[#303036] pt-3">
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#A1A1AA] hover:bg-[#303036]/30 hover:text-[#E50914] transition-colors border-l-2 border-transparent"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </form>
      </div>

      {/* Account Info */}
      <div
        className="px-4 py-4 border-t border-[#303036]"
        style={{ backgroundColor: '#09090B' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#E50914]/20 text-[#E50914] text-sm font-bold">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#FAFAFA] truncate">{fullName}</p>
            <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#E50914]/20 text-[#E50914]">
              {roleLabel}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}

// ─── Mobile Sidebar ───────────────────────────────────────────────────────────

interface MobileSidebarProps extends SidebarProps {
  open: boolean
  onClose: () => void
}

export function MobileSidebar({
  role,
  fullName,
  currentPath = '/admin',
  open,
  onClose,
}: MobileSidebarProps) {
  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(role),
  )
  const initials = getInitials(fullName)
  const roleLabel = getRoleLabel(role)

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 flex flex-col border-r border-[#303036] transition-transform duration-300 lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        style={{ backgroundColor: '#141416' }}
      >
        {/* Logo + close */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-[#303036]">
          <div className="flex flex-col leading-tight">
            <span className="text-2xl font-extrabold tracking-widest text-[#E50914]">
              ORSA
            </span>
            <span className="text-[10px] font-medium tracking-[0.2em] text-[#A1A1AA] uppercase">
              Recruitment
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-[#A1A1AA] hover:bg-[#303036]/40 hover:text-[#FAFAFA] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {visibleItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              currentPath={currentPath}
              onClick={onClose}
            />
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-3 border-t border-[#303036] pt-3">
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#A1A1AA] hover:bg-[#303036]/30 hover:text-[#E50914] transition-colors border-l-2 border-transparent"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div
          className="px-4 py-4 border-t border-[#303036]"
          style={{ backgroundColor: '#09090B' }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#E50914]/20 text-[#E50914] text-sm font-bold">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#FAFAFA] truncate">{fullName}</p>
              <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#E50914]/20 text-[#E50914]">
                {roleLabel}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

// ─── Hamburger button (used in header) ───────────────────────────────────────

interface HamburgerButtonProps {
  onClick: () => void
  className?: string
}

export function HamburgerButton({ onClick, className }: HamburgerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-md p-2 text-[#A1A1AA] hover:bg-[#303036]/40 hover:text-[#FAFAFA] transition-colors lg:hidden',
        className,
      )}
      aria-label="Open menu"
    >
      <Menu className="h-5 w-5" />
    </button>
  )
}
