import type { ReactNode } from 'react';
import Logo from './Logo';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
}

export default function AuthLayout({ children, title, subtitle, showLogo = true }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {showLogo && (
        <div className="flex flex-col items-center mb-8">
          <Logo size={48} showText={false} />
          <h1 className="mt-4 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            USDT NEO
          </h1>
          <p className="mt-1 text-[13px]" style={{ color: 'var(--text-muted)' }}>
            Secure TRC20 Network
          </p>
        </div>
      )}

      {title && (
        <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          {subtitle}
        </p>
      )}

      <div className="w-full" style={{ maxWidth: '400px' }}>
        {children}
      </div>
    </div>
  );
}
