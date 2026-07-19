import { useState } from 'react';
import { Check, X, DollarSign } from 'lucide-react';
import { trpc } from '@/providers/trpc';

export default function AdminWithdrawals() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const utils = trpc.useUtils();

  const { data: withdrawals, isLoading } = trpc.withdrawal.list.useQuery(
    statusFilter !== 'all' ? { status: statusFilter as 'pending' | 'approved' | 'paid' | 'rejected' } : undefined
  );

  const approve = trpc.withdrawal.approve.useMutation({
    onSuccess: () => { utils.withdrawal.list.invalidate(); utils.dashboard.overview.invalidate(); },
  });
  const markPaid = trpc.withdrawal.markPaid.useMutation({
    onSuccess: () => { utils.withdrawal.list.invalidate(); utils.dashboard.overview.invalidate(); },
  });
  const reject = trpc.withdrawal.reject.useMutation({
    onSuccess: () => { utils.withdrawal.list.invalidate(); utils.dashboard.overview.invalidate(); },
  });

  const statusColors: Record<string, string> = {
    pending: 'text-amber-600 bg-amber-50',
    approved: 'text-blue-600 bg-blue-50',
    paid: 'text-green-600 bg-green-50',
    rejected: 'text-red-600 bg-red-50',
  };

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {['all', 'pending', 'approved', 'paid', 'rejected'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${
              statusFilter === s ? 'gradient-primary text-white' : 'glass-card'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {isLoading && <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>Loading...</p>}
        {withdrawals?.length === 0 && <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>No withdrawals</p>}
        {withdrawals?.map((w) => (
          <div key={w.id} className="glass-card p-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {w.userName || 'Unknown'}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {parseFloat(w.amount).toFixed(2)} USDT → {w.address.slice(0, 12)}...
                </p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusColors[w.status]}`}>
                {w.status}
              </span>
            </div>
            {w.paidTxHash && (
              <p className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>TX: {w.paidTxHash.slice(0, 25)}...</p>
            )}
            {w.rejectionReason && (
              <p className="text-[10px] mb-1 text-red-500">Reason: {w.rejectionReason}</p>
            )}
            <div className="flex gap-2 mt-2">
              {w.status === 'pending' && (
                <>
                  <button
                    onClick={() => approve.mutate({ id: w.id })}
                    className="flex-1 text-xs py-2 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center gap-1"
                  >
                    <Check size={12} /> Approve
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt('Rejection reason:');
                      reject.mutate({ id: w.id, reason: reason || undefined });
                    }}
                    className="flex-1 text-xs py-2 rounded-lg bg-red-50 text-red-600 flex items-center justify-center gap-1"
                  >
                    <X size={12} /> Reject
                  </button>
                </>
              )}
              {w.status === 'approved' && (
                <button
                  onClick={() => {
                    const txHash = prompt('Enter transaction hash (optional):');
                    markPaid.mutate({ id: w.id, txHash: txHash || undefined });
                  }}
                  className="w-full text-xs py-2 rounded-lg bg-green-50 text-green-600 flex items-center justify-center gap-1"
                >
                  <DollarSign size={12} /> Mark as Paid
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
