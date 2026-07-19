import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { trpc } from '@/providers/trpc';

const tabs = ['All', 'Withdrawals', 'Upgrades', 'Mining', 'Referrals'];

export default function History() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');

  const { data: upgrades } = trpc.upgrade.myUpgrades.useQuery();
  const { data: withdrawals } = trpc.withdrawal.myWithdrawals.useQuery();

  const allItems = [
    ...(upgrades || []).map((u) => ({
      id: u.id,
      type: 'Upgrade',
      title: `Upgrade to ${u.tierName}`,
      amount: `+${u.tierName}`,
      value: `$${parseFloat(u.amountUsd).toFixed(2)}`,
      status: u.status,
      date: new Date(u.createdAt).toLocaleDateString(),
    })),
    ...(withdrawals || []).map((w) => ({
      id: w.id,
      type: 'Withdrawal',
      title: `Withdrawal to ${w.address.slice(0, 8)}...`,
      amount: `${parseFloat(w.amount).toFixed(2)} USDT`,
      value: `-${parseFloat(w.amount).toFixed(2)} USDT`,
      status: w.status,
      date: new Date(w.createdAt).toLocaleDateString(),
    })),
  ].sort((a, b) => b.id - a.id);

  const filtered = activeTab === 'All' ? allItems : allItems.filter((i) => i.type === activeTab.slice(0, -1));

  const statusColor = (status: string) => {
    if (status === 'approved' || status === 'paid') return 'text-green-600 bg-green-50';
    if (status === 'pending') return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen pt-4 px-4 pb-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/dashboard')} className="p-2 rounded-full glass-card">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>History</h1>
      </div>

      {/* Pending/Approved Counters */}
      <div className="flex gap-3 mb-4">
        <div className="glass-card flex-1 p-3 text-center">
          <p className="text-lg font-bold text-amber-600">
            {allItems.filter((i) => i.status === 'pending').length}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Pending</p>
        </div>
        <div className="glass-card flex-1 p-3 text-center">
          <p className="text-lg font-bold text-green-600">
            {allItems.filter((i) => i.status === 'approved' || i.status === 'paid').length}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Approved</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'gradient-primary text-white'
                : 'glass-card'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-center text-sm py-8" style={{ color: 'var(--text-muted)' }}>
            No transactions found
          </p>
        )}
        {filtered.map((item) => (
          <div key={`${item.type}-${item.id}`} className="glass-card p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  item.type === 'Upgrade' ? 'bg-[var(--accent-teal)]/10 text-[var(--accent-teal)]' :
                  item.type === 'Withdrawal' ? 'bg-red-50 text-red-500' :
                  'bg-blue-50 text-blue-500'
                }`}
              >
                {item.type[0]}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {item.value}
              </p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusColor(item.status)}`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
