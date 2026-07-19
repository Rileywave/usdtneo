import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Crown, Wallet, User } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Crown, label: 'Upgrade', path: '/dashboard/upgrade' },
  { icon: Wallet, label: 'Withdraw', path: '/dashboard/withdraw' },
  { icon: User, label: 'Profile', path: '/dashboard/profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card rounded-none border-t border-white/30 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${
                isActive ? 'text-[var(--accent-teal)]' : 'text-[var(--text-muted)]'
              }`}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
