import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet } from 'lucide-react';
import { trpc } from '@/providers/trpc';

export default function Withdraw() {
  const navigate = useNavigate();
  const { data: user } = trpc.user.me.useQuery();
  const { data: wallet } = trpc.user.getWallet.useQuery();
  const utils = trpc.useUtils();

  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState(wallet?.address || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createWithdrawal = trpc.withdrawal.create.useMutation({
    onSuccess: () => {
      alert('Withdrawal request submitted! We will process it shortly.');
      utils.withdrawal.myWithdrawals.invalidate();
      navigate('/dashboard');
    },
    onError: (err) => alert(err.message),
  });

  const balance = parseFloat(user?.balance || '0');
  const minWithdrawal = 10;

  const handleSubmit = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < minWithdrawal) {
      alert(`Minimum withdrawal is ${minWithdrawal} USDT`);
      return;
    }
    if (amt > balance) {
      alert('Insufficient balance');
      return;
    }
    if (!address || address.length < 10) {
      alert('Please enter a valid wallet address');
      return;
    }
    setIsSubmitting(true);
    createWithdrawal.mutate({
      amount: amount,
      address,
      network: 'TRC20',
    });
  };

  return (
    <div className="min-h-screen pt-4 px-4 pb-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/dashboard')} className="p-2 rounded-full glass-card">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Withdraw</h1>
      </div>

      {/* Balance */}
      <div className="glass-card p-4 mb-6 text-center">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Available Balance</p>
        <p className="text-3xl font-bold gradient-text mt-1">{balance.toFixed(2)} USDT</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Min: {minWithdrawal} USDT</p>
      </div>

      {/* Amount */}
      <div className="glass-card p-4 mb-4">
        <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-muted)' }}>
          Amount (USDT)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full bg-white/50 rounded-xl p-3 text-lg font-semibold outline-none"
          style={{ color: 'var(--text-primary)' }}
        />
        <button
          onClick={() => setAmount(balance.toFixed(2))}
          className="text-xs font-medium mt-2 text-[var(--accent-teal)]"
        >
          Max
        </button>
      </div>

      {/* Wallet Address */}
      <div className="glass-card p-4 mb-6">
        <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-muted)' }}>
          USDT TRC20 Wallet Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your wallet address"
          className="w-full bg-white/50 rounded-xl p-3 text-sm outline-none"
          style={{ color: 'var(--text-primary)' }}
        />
        {wallet?.address && (
          <button
            onClick={() => setAddress(wallet.address)}
            className="text-xs font-medium mt-2 text-[var(--accent-teal)] flex items-center gap-1"
          >
            <Wallet size={12} /> Use bound wallet
          </button>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full gradient-primary text-white font-semibold py-4 rounded-2xl shadow-button disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Request Withdrawal'}
      </button>
    </div>
  );
}
