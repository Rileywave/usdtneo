import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AtSign, Lock } from 'lucide-react';
import { trpc } from '@/providers/trpc';

function ShieldLogo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <defs>
        <linearGradient id="shield-grad-login" x1="0" y1="0" x2="80" y2="80">
          <stop stopColor="#00A896" />
          <stop offset="1" stopColor="#0088CC" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="40" fill="url(#shield-grad-login)" />
      <path
        d="M40 20L24 28V42C24 52.5 30.7 61.3 40 64C49.3 61.3 56 52.5 56 42V28L40 20Z"
        fill="white"
        fillOpacity="0.9"
      />
      <text
        x="40"
        y="48"
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize="22"
        fontWeight="700"
        fontFamily="sans-serif"
      >
        T
      </text>
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('local_auth_token', data.token);
      window.location.href = '/#/dashboard';
    },
    onError: (err) => {
      alert(err.message);
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      alert('Please fill in all fields');
      return;
    }
    setIsSubmitting(true);
    loginMutation.mutate({ emailOrUsername, password });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <motion.div
        className="flex flex-col items-center w-full"
        style={{ maxWidth: '400px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Shield Logo */}
        <ShieldLogo size={48} />

        {/* Title */}
        <h1 className="mt-4 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          USDT NEO
        </h1>
        <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
          Secure TRC20 Network
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="glass-card p-8 w-full mt-6 flex flex-col gap-3.5">
          {/* Email/Username */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 168, 150, 0.08)' }}>
              <AtSign size={16} style={{ color: 'var(--accent-teal)' }} />
            </div>
            <input
              type="text"
              placeholder="Email or username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="w-full py-3 pl-14 pr-4 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--accent-teal)]/20"
              style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 168, 150, 0.08)' }}>
              <Lock size={16} style={{ color: 'var(--accent-teal)' }} />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 pl-14 pr-4 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--accent-teal)]/20"
              style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Login Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full gradient-primary text-white font-semibold text-sm py-3.5 rounded-xl shadow-button mt-1 disabled:opacity-50 cursor-pointer"
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>

        {/* Links */}
        <div className="mt-5 text-center flex flex-col gap-2">
          <button
            onClick={() => navigate('/forgot-password')}
            className="text-[13px] font-medium cursor-pointer"
            style={{ color: 'var(--text-primary)' }}
          >
            Forgot Password?
          </button>
          <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
            Don&apos;t have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-medium cursor-pointer"
              style={{ color: 'var(--accent-blue)' }}
            >
              Create Account
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
