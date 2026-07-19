import { useState } from 'react';
import { Check, X, Image } from 'lucide-react';
import { trpc } from '@/providers/trpc';

export default function AdminUpgrades() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const utils = trpc.useUtils();

  const { data: upgrades, isLoading } = trpc.upgrade.list.useQuery(
    statusFilter !== 'all' ? { status: statusFilter as 'pending' | 'approved' | 'rejected' } : undefined
  );

  const approve = trpc.upgrade.approve.useMutation({
    onSuccess: () => {
      utils.upgrade.list.invalidate();
      utils.dashboard.overview.invalidate();
    },
  });

  const reject = trpc.upgrade.reject.useMutation({
    onSuccess: () => {
      utils.upgrade.list.invalidate();
      utils.dashboard.overview.invalidate();
    },
  });

  const statusColors: Record<string, string> = {
    pending: 'text-amber-600 bg-amber-50',
    approved: 'text-green-600 bg-green-50',
    rejected: 'text-red-600 bg-red-50',
  };

  return (
    <div>
      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {['all', 'pending', 'approved', 'rejected'].map((s) => (
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

      {/* Stats */}
      <div className="glass-card p-3 mb-4 flex gap-4">
        <div className="text-center">
          <p className="text-lg font-bold text-amber-600">{upgrades?.filter((u) => u.status === 'pending').length || 0}</p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Pending</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">{upgrades?.filter((u) => u.status === 'approved').length || 0}</p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Approved</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-red-600">{upgrades?.filter((u) => u.status === 'rejected').length || 0}</p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Rejected</p>
        </div>
      </div>

      {/* Upgrade List */}
      <div className="space-y-2">
        {isLoading && <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>Loading...</p>}
        {upgrades?.length === 0 && <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>No upgrade requests</p>}
        {upgrades?.map((u) => (
          <div key={u.id} className="glass-card p-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {u.userName || 'Unknown'} → {u.tierName}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {u.currency === 'NGN' ? `₦${parseFloat(u.amountLocal).toLocaleString()}` : `${u.amountLocal} USDT`} via {u.paymentMethod}
                </p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusColors[u.status]}`}>
                {u.status}
              </span>
            </div>

            {u.payerName && (
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Payer: {u.payerName}</p>
            )}
            {u.txHash && (
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>TX: {u.txHash.slice(0, 20)}...</p>
            )}
            {u.proofImage && (
              <a href={u.proofImage} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[var(--accent-teal)] flex items-center gap-1 mb-2">
                <Image size={10} /> View Screenshot
              </a>
            )}

            {u.status === 'pending' && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => approve.mutate({ id: u.id })}
                  className="flex-1 text-xs font-medium py-2 rounded-lg bg-green-50 text-green-600 flex items-center justify-center gap-1"
                >
                  <Check size={12} /> Approve
                </button>
                <button
                  onClick={() => {
                    const reason = prompt('Rejection reason:');
                    reject.mutate({ id: u.id, reason: reason || undefined });
                  }}
                  className="flex-1 text-xs font-medium py-2 rounded-lg bg-red-50 text-red-600 flex items-center justify-center gap-1"
                >
                  <X size={12} /> Reject
                </button>
              </div>
            )}
            {u.rejectionReason && (
              <p className="text-[10px] mt-1 text-red-500">Reason: {u.rejectionReason}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
