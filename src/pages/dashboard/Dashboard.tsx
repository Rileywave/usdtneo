import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, History, Wallet, Pickaxe } from 'lucide-react';
import { trpc } from '@/providers/trpc';

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: user } = trpc.user.me.useQuery();
  const mineMutation = trpc.dashboard.mine.useMutation({
    onSuccess: () => {
      alert(`Mined successfully! +${mineMutation.data?.amount} USDT`);
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  const balance = parseFloat(user?.balance || '0');
  const minesToday = user?.minesToday || 0;
  const minesLimit = user?.currentTierName === 'Tier 1' ? 1 : user?.currentTierId ? 2 : 0;

  return (
    <div className="min-h-screen pt-20 px-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {user?.name || 'User'}
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {user?.currentTierName || 'Free Tier'}
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/history')}
          className="p-2 rounded-full glass-card"
        >
          <History size={20} style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>

      {/* Balance Card */}
      <motion.div
        className="gradient-primary rounded-[20px] p-6 text-white mb-6"
        style={{ boxShadow: '0 12px 40px rgba(0, 168, 150, 0.3)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
          Available Balance
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-4xl font-bold">{balance.toFixed(2)}</span>
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>USDT</span>
        </div>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
          ≈ ₦{(balance * 1600).toLocaleString()}
        </p>
      </motion.div>

      {/* Mine Button */}
      <motion.button
        onClick={() => mineMutation.mutate()}
        disabled={mineMutation.isPending || minesToday >= minesLimit}
        className="w-full gradient-primary text-white font-bold text-lg py-4 rounded-2xl shadow-button mb-6 flex items-center justify-center gap-2 disabled:opacity-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Pickaxe size={22} />
        {mineMutation.isPending ? 'Mining...' : `MINE (${minesToday}/${minesLimit})`}
      </motion.button>

      {/* Action Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: ArrowUpRight, label: 'Upgrade', path: '/dashboard/upgrade', color: 'var(--accent-teal)' },
          { icon: History, label: 'History', path: '/dashboard/history', color: '#0088CC' },
          { icon: Wallet, label: 'Withdraw', path: '/dashboard/withdraw', color: 'var(--accent-teal)' },
        ].map((item) => (
          <motion.button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="glass-card p-4 flex flex-col items-center gap-2"
            whileHover={{ y: -2 }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${item.color}15` }}
            >
              <item.icon size={20} style={{ color: item.color }} />
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Mining Stats */}
      <div className="glass-card p-4 mb-4">
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Mining Stats
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Mines Today</p>
            <p className="text-lg font-bold" style={{ color: 'var(--accent-teal)' }}>
              {minesToday}/{minesLimit}
            </p>
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Per Mine</p>
            <p className="text-lg font-bold" style={{ color: 'var(--accent-teal)' }}>
              {user?.currentTierId ? '+1.00 USDT' : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Mined</p>
            <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {parseFloat(user?.totalMined || '0').toFixed(2)} USDT
            </p>
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Withdrawn</p>
            <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {parseFloat(user?.totalWithdrawn || '0').toFixed(2)} USDT
            </p>
          </div>
        </div>
      </div>

      {/* Wallet Binding */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Wallet Binding
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Bind your USDT TRC20 wallet
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard/profile')}
            className="text-xs font-medium px-3 py-1.5 rounded-lg gradient-primary text-white"
          >
            Bind
          </button>
        </div>
      </div>
    </div>
  );
}
