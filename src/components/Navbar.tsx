import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Logo from './Logo';
import { Menu, X, LayoutDashboard, Shield } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const isHome = location.pathname === '/';
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isAdmin = location.pathname.startsWith('/admin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    if (!isHome) {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Hide navbar on dashboard and admin pages
  if (isDashboard || isAdmin) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ height: '64px' }}>
      <div className="mx-auto flex items-center justify-between h-full px-6" style={{ maxWidth: '1200px' }}>
        {/* Logo */}
        <button onClick={() => navigate('/')} className="cursor-pointer">
          <Logo size={36} showText={true} />
        </button>

        {/* Center Nav Links - Desktop */}
        {isHome && (
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Live Stats', id: 'live-stats' },
              { label: 'Features', id: 'features' },
              { label: 'Referral', id: 'referral' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-[13px] font-medium transition-colors duration-200 hover:text-[var(--accent-teal)] cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Right Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="text-[13px] font-medium px-4 py-2 rounded-xl border flex items-center gap-1.5 transition-all hover:border-purple-300"
                  style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                >
                  <Shield size={14} /> Admin
                </button>
              )}
              <button
                onClick={() => navigate('/dashboard')}
                className="text-[13px] font-medium px-5 py-2 rounded-xl border transition-all hover:border-[var(--accent-teal)] flex items-center gap-1.5 cursor-pointer"
                style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
              >
                <LayoutDashboard size={14} /> Dashboard
              </button>
              <button
                onClick={logout}
                className="text-[13px] font-medium px-5 py-2 rounded-xl text-red-500 hover:bg-red-50 transition-all cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-[13px] font-medium px-5 py-2 rounded-xl border transition-all duration-200 hover:border-[var(--accent-teal)] cursor-pointer"
                style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="gradient-primary text-white text-[13px] font-semibold px-5 py-2 rounded-xl shadow-button transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X size={24} style={{ color: 'var(--text-primary)' }} />
          ) : (
            <Menu size={24} style={{ color: 'var(--text-primary)' }} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card mx-4 mt-2 p-4 flex flex-col gap-3">
          {isHome && (
            <>
              {[
                { label: 'Live Stats', id: 'live-stats' },
                { label: 'Features', id: 'features' },
                { label: 'Referral', id: 'referral' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left text-sm font-medium py-2 transition-colors hover:text-[var(--accent-teal)] cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {item.label}
                </button>
              ))}
              <div className="border-t my-1" style={{ borderColor: 'var(--input-border)' }} />
            </>
          )}
          {isAuthenticated ? (
            <>
              <button
                onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
                className="text-left text-sm font-medium py-2 flex items-center gap-2 cursor-pointer"
                style={{ color: 'var(--text-primary)' }}
              >
                <LayoutDashboard size={14} /> Dashboard
              </button>
              {user?.role === 'admin' && (
                <button
                  onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}
                  className="text-left text-sm font-medium py-2 flex items-center gap-2 cursor-pointer"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <Shield size={14} /> Admin Panel
                </button>
              )}
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="text-left text-sm font-medium py-2 text-red-500 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                className="text-left text-sm font-medium py-2 cursor-pointer"
                style={{ color: 'var(--text-primary)' }}
              >
                Login
              </button>
              <button
                onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}
                className="gradient-primary text-white text-sm font-semibold py-2.5 rounded-xl shadow-button cursor-pointer"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
