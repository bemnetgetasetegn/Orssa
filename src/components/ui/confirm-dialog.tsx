'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Info, Loader2 } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  type?: 'destructive' | 'info'
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  type = 'info',
  loading = false,
}: ConfirmDialogProps) {
  const isDestructive = type === 'destructive'

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => !v && onClose()}>
      <DialogContent
        className="sm:max-w-md border border-[#303036]"
        style={{ backgroundColor: '#1D1D20', color: '#FAFAFA' }}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 ${
                isDestructive
                  ? 'bg-red-900/30 text-[#E50914]'
                  : 'bg-blue-900/30 text-blue-400'
              }`}
            >
              {isDestructive ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <Info className="w-5 h-5" />
              )}
            </div>
            <DialogTitle className="text-[#FAFAFA] text-lg font-semibold">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-[#A1A1AA] mt-2 leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="border-[#303036] bg-transparent text-[#A1A1AA] hover:bg-[#09090B] hover:text-[#FAFAFA]"
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className={
              isDestructive
                ? 'bg-[#E50914] hover:bg-[#B91C1C] text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
