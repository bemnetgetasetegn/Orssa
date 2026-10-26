'use client'

import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginInput } from '@/lib/validation/schemas'

// ─── Icon helpers (inline SVG, no extra dep) ─────────────────────────────────
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  )
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

// ─── Error message map ────────────────────────────────────────────────────────
const ERROR_MESSAGES: Record<string, string> = {
  account_suspended: 'Your account has been suspended. Please contact an administrator.',
  unauthorized: 'You do not have permission to access this system.',
  session_expired: 'Your session has expired. Please sign in again.',
}

// ─── Component ────────────────────────────────────────────────────────────────
import { Suspense } from 'react'
import { validateEmployeeLoginRef } from '@/app/actions/auth'

function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const [subdomain, setSubdomain] = useState<'admin' | 'employee' | 'main'>('main')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.host.toLowerCase()
      if (host.startsWith('admin.') || host === 'admin.localhost' || host.startsWith('admin-')) {
        setSubdomain('admin')
      } else if (host.startsWith('employee.') || host === 'employee.localhost' || host.startsWith('employee-')) {
        setSubdomain('employee')
      } else {
        setSubdomain('main')
      }
    }
  }, [])
  const errorParam = searchParams.get('error')
  const refParam = searchParams.get('ref')

  const queryError = errorParam ? ERROR_MESSAGES[errorParam] ?? null : null

  const [refLoading, setRefLoading] = useState(!!refParam)
  const [refEmployee, setRefEmployee] = useState<{
    employee_name: string
    email: string
    employee_code: string
  } | null>(null)
  const [refError, setRefError] = useState<string | null>(null)
  const [previousSessionCleared, setPreviousSessionCleared] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  // Validate employee ref link on mount
  useEffect(() => {
    if (!refParam) {
      setRefLoading(false)
      return
    }

    let isMounted = true
    setRefLoading(true)
    setRefError(null)

    async function checkRef() {
      const res = await validateEmployeeLoginRef(refParam!)
      if (!isMounted) return

      if (!res.success || !res.data) {
        setRefError(res.error || 'This unique employee login link is invalid or has expired.')
        setRefLoading(false)
        return
      }

      setRefEmployee(res.data)
      setValue('email', res.data.email)

      // Check if there is an active session in the browser
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!isMounted) return

      if (user) {
        if (user.email?.toLowerCase() === res.data.email.toLowerCase()) {
          // Already logged in as this exact candidate
          window.location.href = '/employee'
          return
        } else {
          // Signed in as another user (e.g. admin or different employee)
          // Clear it so candidate login isn't blocked or misdirected
          await supabase.auth.signOut()
          setPreviousSessionCleared(true)
        }
      }

      setRefLoading(false)
    }

    checkRef()

    return () => {
      isMounted = false
    }
  }, [refParam, setValue])

  const isLoading = isPending || isSubmitting

  function onSubmit(values: LoginInput) {
    setServerError(null)

    // Security check: If accessing via unique candidate link, email MUST strictly match the assigned employee!
    if (refEmployee) {
      if (values.email.trim().toLowerCase() !== refEmployee.email.trim().toLowerCase()) {
        setServerError(
          `Security violation: This unique link is strictly reserved for ${refEmployee.email}. Signing in with another account is prohibited.`
        )
        return
      }
    }

    startTransition(async () => {
      const supabase = createClient()

      // 1. Authenticate with browser Supabase client
      const targetEmail = refEmployee ? refEmployee.email : values.email
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: values.password,
      })

      if (authError || !authData.user) {
        setServerError('Invalid email or password.')
        return
      }

      // Security check: Verify that authenticated user email strictly matches the ref employee
      if (refEmployee && authData.user.email?.toLowerCase() !== refEmployee.email.toLowerCase()) {
        await supabase.auth.signOut()
        setServerError(
          `Security violation: This unique link is designated for ${refEmployee.email}. You cannot use it to sign in with a different account.`
        )
        return
      }

      // 2. Fetch user profile to get role and check suspension
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, account_status')
        .eq('id', authData.user.id)
        .single()

      if (profile?.account_status === 'suspended') {
        await supabase.auth.signOut()
        setServerError('Your account has been suspended. Please contact an administrator.')
        return
      }

      // Security role validation against current subdomain
      if (subdomain === 'admin' && profile?.role === 'employee') {
        await supabase.auth.signOut()
        setServerError('Access restricted: Candidate accounts must sign in via employee.orssa.net.')
        return
      }

      if (subdomain === 'employee' && (profile?.role === 'super_admin' || profile?.role === 'sub_admin')) {
        await supabase.auth.signOut()
        setServerError('Access restricted: Administrative and staff accounts must sign in via admin.orssa.net.')
        return
      }

      if (profile?.role === 'employee') {
        window.location.href = '/employee'
      } else if (profile?.role === 'sub_admin') {
        window.location.href = '/admin/employees'
      } else {
        window.location.href = '/admin'
      }
    })
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#09090B' }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-2xl"
        style={{ backgroundColor: '#1D1D20', border: '1px solid #303036' }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <span
            className="text-4xl font-black tracking-widest"
            style={{ color: '#E50914' }}
          >
            ORSA
          </span>
          <p className="mt-1 text-sm tracking-wider uppercase" style={{ color: '#A1A1AA' }}>
            {subdomain === 'admin'
              ? 'Administration Portal'
              : subdomain === 'employee'
              ? 'Candidate Portal'
              : 'Recruitment Management'}
          </p>
          <div className="mt-2">
            {subdomain === 'admin' ? (
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#E50914]/15 text-[#E50914] border border-[#E50914]/30">
                Super Admin & Sub-Admin Login
              </span>
            ) : subdomain === 'employee' ? (
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Verified Candidate Access
              </span>
            ) : null}
          </div>
        </div>

        {refLoading ? (
          <div className="py-12 text-center space-y-3">
            <div className="flex justify-center text-[#E50914]">
              <SpinnerIcon />
            </div>
            <p className="text-sm font-medium text-[#FAFAFA]">
              Verifying unique candidate portal link...
            </p>
            <p className="text-xs text-[#A1A1AA]">
              Securing candidate credentials
            </p>
          </div>
        ) : refError ? (
          <div className="space-y-4">
            <div
              className="rounded-xl p-5 text-center space-y-3"
              style={{ backgroundColor: '#2d1515', border: '1px solid #7f1d1d' }}
            >
              <div className="flex justify-center text-[#EF4444]">
                <AlertIcon />
              </div>
              <h3 className="text-sm font-bold text-[#FAFAFA]">
                Invalid or Expired Link
              </h3>
              <p className="text-xs text-[#fca5a5] leading-relaxed">
                {refError}
              </p>
            </div>
            <div className="text-center pt-2">
              <a
                href="/login"
                className="inline-block px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors"
                style={{ backgroundColor: '#303036', color: '#FAFAFA' }}
              >
                Go to Standard Login
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Unique Employee Access Banner */}
            {refEmployee && (
              <div
                className="mb-5 rounded-xl p-4 text-xs space-y-1.5"
                style={{
                  backgroundColor: 'rgba(229, 9, 20, 0.08)',
                  border: '1px solid rgba(229, 9, 20, 0.4)',
                }}
              >
                <div className="flex items-center gap-2 font-semibold" style={{ color: '#E50914' }}>
                  <LockIcon />
                  <span>Unique Candidate Portal Access</span>
                </div>
                <p className="text-sm font-bold" style={{ color: '#FAFAFA' }}>
                  {refEmployee.employee_name}{' '}
                  <span className="text-xs font-mono font-normal" style={{ color: '#A1A1AA' }}>
                    ({refEmployee.employee_code})
                  </span>
                </p>
                <p style={{ color: '#A1A1AA' }}>
                  This direct link is bound exclusively to this candidate account. Enter your assigned temporary password below to sign in.
                </p>
                {previousSessionCleared && (
                  <p
                    className="pt-1.5 mt-1 border-t text-[11px]"
                    style={{ borderColor: '#303036', color: '#facc15' }}
                  >
                    Note: Previous active session in this browser was cleared to allow dedicated candidate access.
                  </p>
                )}
              </div>
            )}

            {/* Query-param error banner */}
            {queryError && (
              <div
                className="mb-5 flex items-start gap-2 rounded-lg px-4 py-3 text-sm"
                style={{ backgroundColor: '#3b0d0d', color: '#fca5a5', border: '1px solid #EF4444' }}
              >
                <span className="mt-0.5 shrink-0"><AlertIcon /></span>
                <span>{queryError}</span>
              </div>
            )}

            {/* Server error banner */}
            {serverError && (
              <div
                className="mb-5 flex items-start gap-2 rounded-lg px-4 py-3 text-sm"
                style={{ backgroundColor: '#3b0d0d', color: '#fca5a5', border: '1px solid #EF4444' }}
              >
                <span className="mt-0.5 shrink-0"><AlertIcon /></span>
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {/* Email */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium"
                    style={{ color: '#FAFAFA' }}
                  >
                    {subdomain === 'admin'
                      ? 'Staff Email Address'
                      : subdomain === 'employee'
                      ? 'Candidate Email Address'
                      : 'Email address'}
                  </label>
                  {refEmployee && (
                    <span className="flex items-center gap-1 text-[11px] font-medium" style={{ color: '#E50914' }}>
                      <LockIcon /> Locked to Candidate
                    </span>
                  )}
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  readOnly={!!refEmployee}
                  disabled={isLoading}
                  {...register('email')}
                  placeholder="you@example.com"
                  className={`w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-[#52525b] disabled:opacity-50 ${
                    refEmployee ? 'cursor-not-allowed opacity-90' : ''
                  }`}
                  style={{
                    backgroundColor: refEmployee ? '#141416' : '#09090B',
                    border: `1px solid ${errors.email ? '#EF4444' : refEmployee ? '#E50914' : '#303036'}`,
                    color: '#FAFAFA',
                  }}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs" style={{ color: '#EF4444' }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: '#FAFAFA' }}
                >
                  {refEmployee ? 'Temporary Password' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    disabled={isLoading}
                    {...register('password')}
                    placeholder="••••••••"
                    className="w-full rounded-lg px-4 py-2.5 pr-10 text-sm outline-none transition-colors placeholder:text-[#52525b] disabled:opacity-50"
                    style={{
                      backgroundColor: '#09090B',
                      border: `1px solid ${errors.password ? '#EF4444' : '#303036'}`,
                      color: '#FAFAFA',
                    }}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: '#A1A1AA' }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs" style={{ color: '#EF4444' }}>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-opacity disabled:opacity-60"
                style={{ backgroundColor: '#E50914', color: '#FAFAFA' }}
              >
                {isLoading ? (
                  <>
                    <SpinnerIcon />
                    Signing in…
                  </>
                ) : refEmployee ? (
                  'Access Candidate Portal'
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </>
        )}

        <p className="mt-8 text-center text-xs" style={{ color: '#52525b' }}>
          © {new Date().getFullYear()} ORSA · Recruitment Management System
        </p>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090B]" />}>
      <LoginForm />
    </Suspense>
  )
}

