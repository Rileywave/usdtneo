import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { trpc } from '@/providers/trpc';

export default function Upgrade() {
  const navigate = useNavigate();
  const { data: tiers } = trpc.tier.list.useQuery();
  const { data: user } = trpc.user.me.useQuery();

  const currentTierId = user?.currentTierId || 0;

  return (
    <div className="min-h-screen pt-4 px-4 pb-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/dashboard')} className="p-2 rounded-full glass-card">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Upgrade Tier
        </h1>
      </div>

      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
        Choose a tier to increase your daily mining earnings
      </p>

      <div className="space-y-3">
        {tiers?.map((tier, index) => {
          const isCurrent = tier.id === currentTierId;
          const isFree = tier.level === 1;

          return (
            <motion.div
              key={tier.id}
              className={`glass-card p-4 ${isCurrent ? 'ring-2 ring-[var(--accent-teal)]' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">
                    T{tier.level}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                      {tier.name}
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {tier.period} days period
                    </p>
                  </div>
                </div>
                {isCurrent && (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--accent-teal)]/10 text-[var(--accent-teal)]">
                    Current
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-white/50 rounded-lg p-2">
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Earn per 24h</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--accent-teal)' }}>
                    {parseFloat(tier.earnPerDay).toFixed(2)} USDT
                  </p>
                </div>
                <div className="bg-white/50 rounded-lg p-2">
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Mines/day</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    {tier.minesPerDay}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Price</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    {isFree ? 'Free' : `$${parseFloat(tier.priceUsd).toFixed(2)}`}
                  </p>
                  {!isFree && (
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      ₦{parseFloat(tier.priceNgn).toLocaleString()}
                    </p>
                  )}
                </div>
                {!isCurrent && tier.level > 1 && (
                  <button
                    onClick={() => navigate('/dashboard/payment-method', { state: { tier } })}
                    className="gradient-primary text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-button"
                  >
                    Upgrade
                  </button>
                )}
                {isCurrent && (
                  <span className="text-xs font-medium px-3 py-2 rounded-xl bg-green-50 text-green-600 flex items-center gap-1">
                    <Check size={14} /> Active
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
