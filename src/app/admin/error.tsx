'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AdminErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin Portal error:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#1D1D20] border border-[#303036] rounded-xl p-6 text-center space-y-4 shadow-xl">
        <h2 className="text-xl font-bold text-[#FAFAFA]">Admin Action Failed</h2>
        <p className="text-sm text-[#A1A1AA]">
          The server could not complete the request. Please try again or return to the employee directory.
        </p>
        {error.digest && (
          <p className="text-xs font-mono text-[#71717A] bg-[#141416] p-2 rounded border border-[#303036]">
            Digest: {error.digest}
          </p>
        )}
        <div className="pt-2 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-lg bg-[#E50914] text-sm font-semibold text-white hover:bg-[#B91C1C] transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/admin/employees"
            className="px-5 py-2.5 rounded-lg border border-[#303036] text-sm font-medium text-[#A1A1AA] hover:text-white hover:bg-[#141416] transition-colors"
          >
            Employees List
          </Link>
        </div>
      </div>
    </div>
  )
}
