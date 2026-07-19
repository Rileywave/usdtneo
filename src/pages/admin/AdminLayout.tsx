import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, Users, ArrowUpRight, Wallet, Settings, Share2, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: ArrowUpRight, label: 'Upgrades', path: '/admin/upgrades' },
  { icon: Wallet, label: 'Withdrawals', path: '/admin/withdrawals' },
  { icon: Share2, label: 'Referrals', path: '/admin/referrals' },
  { icon: FileText, label: 'Logs', path: '/admin/logs' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Access Denied</h1>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Admin access required</p>
          <button onClick={() => navigate('/dashboard')} className="gradient-primary text-white px-6 py-2 rounded-xl">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-4 px-4 pb-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/dashboard')} className="p-2 rounded-full glass-card">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Admin Panel</h1>
      </div>

      {/* Admin Nav */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'gradient-primary text-white'
                  : 'glass-card'
              }`}
            >
              <item.icon size={14} />
              {item.label}
            </button>
          );
        })}
      </div>

      <Outlet />
    </div>
  );
}
