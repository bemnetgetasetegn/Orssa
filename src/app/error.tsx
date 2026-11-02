'use client'

import { useEffect } from 'react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error boundary caught:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0C0C0E] text-white p-6">
      <div className="max-w-md w-full bg-[#1D1D20] border border-[#303036] rounded-xl p-6 text-center space-y-4 shadow-xl">
        <h2 className="text-xl font-bold text-[#FAFAFA]">Something went wrong</h2>
        <p className="text-sm text-[#A1A1AA]">
          An unexpected error occurred while processing your request.
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
          <a
            href="/"
            className="px-5 py-2.5 rounded-lg border border-[#303036] text-sm font-medium text-[#A1A1AA] hover:text-white hover:bg-[#141416] transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}
