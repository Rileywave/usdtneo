import { useState } from 'react';
import { Search, Shield, ShieldOff, UserCheck } from 'lucide-react';
import { trpc } from '@/providers/trpc';

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const utils = trpc.useUtils();

  const { data: users, isLoading } = trpc.user.list.useQuery(search ? { search } : undefined);

  const updateUser = trpc.user.update.useMutation({
    onSuccess: () => utils.user.list.invalidate(),
  });

  const suspend = trpc.user.suspend.useMutation({
    onSuccess: () => utils.user.list.invalidate(),
  });

  const activate = trpc.user.activate.useMutation({
    onSuccess: () => utils.user.list.invalidate(),
  });

  return (
    <div>
      {/* Search */}
      <div className="glass-card p-3 mb-4 flex items-center gap-2">
        <Search size={16} style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email..."
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: 'var(--text-primary)' }}
        />
      </div>

      {/* User List */}
      <div className="space-y-2">
        {isLoading && <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>Loading...</p>}
        {users?.length === 0 && <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>No users found</p>}
        {users?.map((u) => (
          <div key={u.id} className="glass-card p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                  {u.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {u.name || 'Unknown'}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{u.email || 'No email'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  u.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  {u.status}
                </span>
                {u.role === 'admin' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">
                    Admin
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>Balance: <strong className="text-[var(--accent-teal)]">{parseFloat(u.balance || '0').toFixed(2)} USDT</strong></span>
              <span>{u.currentTierName || 'No tier'}</span>
            </div>
            <div className="flex gap-2 mt-2">
              {u.role !== 'admin' && (
                <button
                  onClick={() => updateUser.mutate({ id: u.id, role: 'admin' })}
                  className="text-[10px] px-2 py-1 rounded bg-purple-50 text-purple-600 flex items-center gap-1"
                >
                  <Shield size={10} /> Make Admin
                </button>
              )}
              {u.status === 'active' ? (
                <button
                  onClick={() => suspend.mutate({ id: u.id })}
                  className="text-[10px] px-2 py-1 rounded bg-red-50 text-red-600 flex items-center gap-1"
                >
                  <ShieldOff size={10} /> Suspend
                </button>
              ) : (
                <button
                  onClick={() => activate.mutate({ id: u.id })}
                  className="text-[10px] px-2 py-1 rounded bg-green-50 text-green-600 flex items-center gap-1"
                >
                  <UserCheck size={10} /> Activate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
