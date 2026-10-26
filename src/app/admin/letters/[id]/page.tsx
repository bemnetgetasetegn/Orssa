import { notFound } from 'next/navigation'
import { requireAdmin, canManageEmployee } from '@/lib/auth/helpers'
import { getApplicationLetter, getLetterTemplates } from '@/app/actions/letters'
import { AdminLayout } from '@/components/layout/admin-layout'
import LetterEditorClient from './LetterEditorClient'
import type { LetterTemplate } from '@/types/database'

export const dynamic = 'force-dynamic'

interface LetterEditorPageProps {
  params: Promise<{ id: string }>
}

export default async function LetterEditorPage({ params }: LetterEditorPageProps) {
  const profile = await requireAdmin()
  const { id } = await params

  const canManage = await canManageEmployee(id)
  if (!canManage) {
    notFound()
  }

  // id here is the employee_id
  const letterRes = await getApplicationLetter(id)
  if (!letterRes.success || !letterRes.data) {
    notFound()
  }

  const templatesRes = await getLetterTemplates()

  return (
    <AdminLayout title="Letter Editor">
      <LetterEditorClient
        letter={letterRes.data as any}
        templates={(templatesRes.data as LetterTemplate[]) || []}
      />
    </AdminLayout>
  )
}
