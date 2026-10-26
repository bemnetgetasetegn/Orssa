import { requireSuperAdmin } from '@/lib/auth/helpers'
import { createClient } from '@/lib/supabase/server'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Clock, ShieldAlert, User, Database, Filter } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AuditLogsPage() {
  await requireSuperAdmin()
  const supabase = await createClient()

  const { data: rawLogs } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  let logs = rawLogs || []
  const actorIds = [...new Set(logs.map((l) => l.actor_user_id).filter(Boolean))]
  if (actorIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .in('id', actorIds)

    const profileMap = new Map((profiles || []).map((p) => [p.id, p]))
    logs = logs.map((l) => ({
      ...l,
      actor: l.actor_user_id ? profileMap.get(l.actor_user_id) : undefined,
    }))
  }

  return (
    <AdminLayout title="Audit Logs">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#FAFAFA]">System Audit Logs</h1>
          <p className="text-sm text-[#A1A1AA]">
            Immutable record of administrative operations, credential generation events, and access changes.
          </p>
        </div>

        <div className="rounded-xl border border-[#303036] bg-[#1D1D20] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#303036] bg-[#141416]/50 text-[#A1A1AA]">
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Operator / Actor</th>
                <th className="py-3 px-4 font-semibold">Action Performed</th>
                <th className="py-3 px-4 font-semibold">Target Entity</th>
                <th className="py-3 px-4 font-semibold">Metadata Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#303036]/50">
              {(!logs || logs.length === 0) ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#A1A1AA]">
                    No audit log records captured yet.
                  </td>
                </tr>
              ) : (
                logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-[#141416]/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[#A1A1AA] whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-[#FAFAFA] font-medium">
                      {log.actor?.full_name || 'System / Service'}
                      <span className="block text-[10px] text-[#A1A1AA] font-mono">
                        {log.actor?.role || 'Service Role'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-[#141416] border border-[#303036] text-[#E50914]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#FAFAFA]">
                      <span className="font-semibold">{log.entity_type}</span>
                      {log.entity_id && (
                        <span className="block font-mono text-[10px] text-[#A1A1AA]">
                          {log.entity_id.slice(0, 8)}...
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#A1A1AA] font-mono text-[11px] max-w-xs truncate">
                      {JSON.stringify(log.metadata || {})}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
