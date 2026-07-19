import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet } from 'lucide-react';

export default function PaymentMethod() {
  const navigate = useNavigate();
  const location = useLocation();
  const tier = location.state?.tier;

  if (!tier) {
    navigate('/dashboard/upgrade');
    return null;
  }

  return (
    <div className="min-h-screen pt-4 px-4 pb-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/dashboard/upgrade')} className="p-2 rounded-full glass-card">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Payment Method</h1>
      </div>

      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        Select your preferred currency for <strong>Tier {tier.level}</strong>
      </p>

      <div className="space-y-3">
        <button
          onClick={() => navigate('/dashboard/ngn-transfer', { state: { tier } })}
          className="w-full glass-card p-4 flex items-center gap-4 hover:border-[var(--accent-teal)]/30 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-[var(--accent-teal)]/10 flex items-center justify-center">
            <Wallet size={22} style={{ color: 'var(--accent-teal)' }} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Pay with Naira</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>NGN</p>
          </div>
          <ArrowLeft size={18} className="rotate-180" style={{ color: 'var(--text-muted)' }} />
        </button>

        <button
          onClick={() => navigate('/dashboard/usdt-deposit', { state: { tier } })}
          className="w-full gradient-primary text-white p-4 flex items-center gap-4 rounded-[20px]"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Wallet size={22} color="white" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-sm">Pay with USDT</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>TRC20</p>
          </div>
          <ArrowLeft size={18} className="rotate-180" color="white" />
        </button>
      </div>

      <div className="mt-6 glass-card p-4 text-center">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Amount to Pay</p>
        <p className="text-2xl font-bold gradient-text">${parseFloat(tier.priceUsd).toFixed(2)}</p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>₦{parseFloat(tier.priceNgn).toLocaleString()}</p>
      </div>
    </div>
  );
}
