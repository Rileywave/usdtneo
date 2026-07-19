import { Share2, Users, TrendingUp } from 'lucide-react';
import { trpc } from '@/providers/trpc';

export default function AdminReferrals() {
  const { data: topReferrers } = trpc.referral.topReferrers.useQuery();
  const { data: allEarnings } = trpc.referral.allEarnings.useQuery();

  const totalPayout = allEarnings?.reduce((sum, e) => sum + parseFloat(e.amount as unknown as string), 0) || 0;

  return (
    <div>
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="glass-card p-3 text-center">
          <Users size={18} className="mx-auto mb-1 text-[var(--accent-teal)]" />
          <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {allEarnings?.length || 0}
          </p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Total Earnings</p>
        </div>
        <div className="glass-card p-3 text-center">
          <Share2 size={18} className="mx-auto mb-1 text-[var(--accent-teal)]" />
          <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {new Set(allEarnings?.map((e) => e.referrerId)).size || 0}
          </p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Referrers</p>
        </div>
        <div className="glass-card p-3 text-center">
          <TrendingUp size={18} className="mx-auto mb-1 text-green-600" />
          <p className="text-lg font-bold text-green-600">
            {totalPayout.toFixed(2)}
          </p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Total Payouts</p>
        </div>
      </div>

      {/* Top Referrers */}
      <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Top Referrers</h3>
      <div className="space-y-2 mb-6">
        {topReferrers?.length === 0 && (
          <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>No referral data</p>
        )}
        {topReferrers?.map((r, i) => (
          <div key={r.referrerId} className="glass-card p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {r.userName || 'Unknown'}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {r.referralCount} referrals
                </p>
              </div>
            </div>
            <p className="text-sm font-bold text-[var(--accent-teal)]">
              {parseFloat(r.totalEarned).toFixed(2)} USDT
            </p>
          </div>
        ))}
      </div>

      {/* All Earnings */}
      <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Recent Earnings</h3>
      <div className="space-y-2">
        {allEarnings?.slice(0, 50).map((e) => (
          <div key={e.id} className="glass-card p-2 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                {e.referrerName || 'Unknown'} → Tier {e.tier}
              </p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                {e.source} · {new Date(e.createdAt).toLocaleDateString()}
              </p>
            </div>
            <p className="text-xs font-bold text-[var(--accent-teal)]">
              +{parseFloat(e.amount as unknown as string).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
