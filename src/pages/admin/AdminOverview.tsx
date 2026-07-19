import { motion } from 'framer-motion';
import { Users, ArrowUpRight, Wallet, Pickaxe, Share2, AlertTriangle } from 'lucide-react';
import { trpc } from '@/providers/trpc';

export default function AdminOverview() {
  const { data: overview } = trpc.dashboard.overview.useQuery();

  const stats = [
    {
      label: 'Total Users',
      value: overview?.users.totalUsers || 0,
      active: overview?.users.activeUsers || 0,
      suspended: overview?.users.suspendedUsers || 0,
      icon: Users,
      color: 'var(--accent-teal)',
    },
    {
      label: 'Total Balance (Liability)',
      value: `${parseFloat(overview?.users.totalBalance || '0').toFixed(2)} USDT`,
      detail: 'Sum of all user balances',
      icon: Wallet,
      color: '#0088CC',
    },
    {
      label: 'Upgrade Revenue',
      value: `$${parseFloat(overview?.upgrades?.totalRevenue || '0').toFixed(2)}`,
      detail: `${overview?.upgrades?.approved || 0} approved upgrades`,
      icon: ArrowUpRight,
      color: 'var(--accent-teal)',
    },
    {
      label: 'Total Withdrawn',
      value: `${parseFloat(overview?.withdrawals?.totalPaid || '0').toFixed(2)} USDT`,
      detail: `${overview?.withdrawals?.paid || 0} paid withdrawals`,
      icon: Wallet,
      color: '#e74c3c',
    },
    {
      label: 'Total Mined',
      value: `${parseFloat(overview?.mining?.totalMined || '0').toFixed(2)} USDT`,
      detail: `${overview?.mining?.totalSessions || 0} mining sessions`,
      icon: Pickaxe,
      color: 'var(--accent-teal)',
    },
    {
      label: 'Referral Payouts',
      value: `${parseFloat(overview?.referrals?.totalReferralPayouts || '0').toFixed(2)} USDT`,
      detail: `${overview?.referrals?.totalReferralCount || 0} referral transactions`,
      icon: Share2,
      color: '#9b59b6',
    },
  ];

  const pendingActions = [
    { label: 'Pending Upgrades', count: overview?.upgrades?.pending || 0, color: 'text-amber-600' },
    { label: 'Pending Withdrawals', count: overview?.withdrawals?.pending || 0, color: 'text-amber-600' },
    { label: 'Approved (Unpaid)', count: overview?.withdrawals?.approved || 0, color: 'text-blue-600' },
  ];

  return (
    <div>
      {/* Pending Actions Banner */}
      {pendingActions.some((a) => a.count > 0) && (
        <motion.div
          className="glass-card p-4 mb-4 border-amber-200"
          style={{ backgroundColor: 'rgba(251, 191, 36, 0.05)' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-amber-500" />
            <span className="text-sm font-semibold text-amber-700">Action Required</span>
          </div>
          <div className="flex gap-4">
            {pendingActions.map((a) => (
              <div key={a.label} className="text-center">
                <p className={`text-lg font-bold ${a.color}`}>{a.count}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{a.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="glass-card p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon size={16} style={{ color: stat.color }} />
              </div>
              <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                {stat.label}
              </p>
            </div>
            <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {stat.value}
            </p>
            {stat.detail && (
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{stat.detail}</p>
            )}
            {stat.active !== undefined && (
              <div className="flex gap-3 mt-2">
                <span className="text-[10px] text-green-600">{stat.active} active</span>
                <span className="text-[10px] text-red-500">{stat.suspended} suspended</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
