import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, LogOut, Shield } from 'lucide-react';
import { trpc } from '@/providers/trpc';
import { useAuth } from '@/hooks/useAuth';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile } = trpc.user.me.useQuery();
  const utils = trpc.useUtils();
  const { logout } = useAuth();

  const [walletAddress, setWalletAddress] = useState('');

  const bindWallet = trpc.user.bindWallet.useMutation({
    onSuccess: () => {
      alert('Wallet bound successfully!');
      utils.user.getWallet.invalidate();
      setWalletAddress('');
    },
    onError: (err) => alert(err.message),
  });

  const handleBindWallet = () => {
    if (!walletAddress || walletAddress.length < 10) {
      alert('Please enter a valid TRC20 wallet address');
      return;
    }
    bindWallet.mutate({ address: walletAddress, network: 'TRC20' });
  };

  const copyReferralCode = () => {
    const code = profile?.referralCode || `USER${profile?.id}`;
    navigator.clipboard.writeText(code);
    alert('Referral code copied!');
  };

  return (
    <div className="min-h-screen pt-4 px-4 pb-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/dashboard')} className="p-2 rounded-full glass-card">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Profile</h1>
      </div>

      {/* User Info */}
      <div className="glass-card p-4 mb-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-white text-xl font-bold">
          {profile?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {profile?.name || 'User'}
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {profile?.email || 'No email'}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent-teal)]/10 text-[var(--accent-teal)] font-medium">
              {profile?.currentTierName || 'Free Tier'}
            </span>
            {profile?.role === 'admin' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium flex items-center gap-1">
                <Shield size={10} /> Admin
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Referral Code */}
      <div className="glass-card p-4 mb-4">
        <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>My Referral Code</p>
        <div
          className="bg-white/50 rounded-xl p-3 flex items-center justify-between cursor-pointer"
          onClick={copyReferralCode}
        >
          <span className="text-sm font-bold text-[var(--accent-teal)]">
            {profile?.referralCode || `USER${profile?.id}`}
          </span>
          <Copy size={16} style={{ color: 'var(--text-muted)' }} />
        </div>
        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
          Share this code with friends to earn referral commissions
        </p>
      </div>

      {/* Wallet Binding */}
      <div className="glass-card p-4 mb-4">
        <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
          USDT TRC20 Wallet Address
        </p>
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Enter your wallet address"
          className="w-full bg-white/50 rounded-xl p-3 text-sm outline-none mb-2"
          style={{ color: 'var(--text-primary)' }}
        />
        <button
          onClick={handleBindWallet}
          disabled={bindWallet.isPending}
          className="w-full gradient-primary text-white text-sm font-semibold py-3 rounded-xl shadow-button disabled:opacity-50"
        >
          {bindWallet.isPending ? 'Binding...' : 'Bind Wallet'}
        </button>
      </div>

      {/* Admin Link */}
      {user?.role === 'admin' && (
        <button
          onClick={() => navigate('/admin')}
          className="w-full glass-card p-4 mb-4 flex items-center gap-3 text-left"
        >
          <Shield size={20} style={{ color: 'var(--accent-teal)' }} />
          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Admin Panel</span>
        </button>
      )}

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full glass-card p-4 flex items-center gap-3 text-red-500"
      >
        <LogOut size={20} />
        <span className="font-medium text-sm">Logout</span>
      </button>
    </div>
  );
}
