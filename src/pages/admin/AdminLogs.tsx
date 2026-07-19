import { FileText, UserCheck, XCircle, DollarSign } from 'lucide-react';
import { trpc } from '@/providers/trpc';

const actionIcons: Record<string, React.ReactNode> = {
  approve_upgrade: <UserCheck size={14} className="text-green-600" />,
  reject_upgrade: <XCircle size={14} className="text-red-600" />,
  approve_withdrawal: <UserCheck size={14} className="text-green-600" />,
  reject_withdrawal: <XCircle size={14} className="text-red-600" />,
  mark_withdrawal_paid: <DollarSign size={14} className="text-blue-600" />,
  default: <FileText size={14} style={{ color: 'var(--text-muted)' }} />,
};

export default function AdminLogs() {
  const { data: logs, isLoading } = trpc.admin.logs.useQuery();

  return (
    <div>
      <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Admin Action Log</h2>

      {isLoading && <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>Loading...</p>}
      {logs?.length === 0 && <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>No logs yet</p>}

      <div className="space-y-2">
        {logs?.map((log) => (
          <div key={log.id} className="glass-card p-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {actionIcons[log.action] || actionIcons.default}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    {log.adminName || 'Admin'}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100" style={{ color: 'var(--text-muted)' }}>
                    {log.action}
                  </span>
                </div>
                {log.details && (
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {log.details}
                  </p>
                )}
                <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
