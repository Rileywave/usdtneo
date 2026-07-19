import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, IdCard, AtSign, Lock, Gift } from 'lucide-react';
import { trpc } from '@/providers/trpc';

function ShieldLogo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <defs>
        <linearGradient id="shield-grad-reg" x1="0" y1="0" x2="80" y2="80">
          <stop stopColor="#00A896" />
          <stop offset="1" stopColor="#0088CC" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="40" fill="url(#shield-grad-reg)" />
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

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerMutation = trpc.localAuth.register.useMutation({
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
    if (!fullName || !username || !email || !password) {
      alert('Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    if (!agreed) {
      alert('Please agree to the terms and conditions');
      return;
    }
    setIsSubmitting(true);
    registerMutation.mutate({
      fullName,
      username,
      email,
      password,
      referralCode: referralCode || undefined,
    });
  };

  const inputClass = "w-full py-3 pl-14 pr-4 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--accent-teal)]/20";
  const inputStyle = { backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8">
      <motion.div
        className="flex flex-col items-center w-full"
        style={{ maxWidth: '420px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Shield Logo */}
        <ShieldLogo size={48} />

        {/* Title */}
        <h1 className="mt-4 text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Create your USDT NEO account
        </h1>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="glass-card p-7 w-full mt-6 flex flex-col gap-3">
          {/* Full Name */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 168, 150, 0.08)' }}>
              <User size={16} style={{ color: 'var(--accent-teal)' }} />
            </div>
            <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} style={inputStyle} />
          </div>

          {/* Username */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 168, 150, 0.08)' }}>
              <IdCard size={16} style={{ color: 'var(--accent-teal)' }} />
            </div>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} style={inputStyle} />
          </div>

          {/* Email */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 168, 150, 0.08)' }}>
              <AtSign size={16} style={{ color: 'var(--accent-teal)' }} />
            </div>
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} style={inputStyle} />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 168, 150, 0.08)' }}>
              <Lock size={16} style={{ color: 'var(--accent-teal)' }} />
            </div>
            <input type="password" placeholder="Password (min 6)" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} style={inputStyle} />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 168, 150, 0.08)' }}>
              <Lock size={16} style={{ color: 'var(--accent-teal)' }} />
            </div>
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} style={inputStyle} />
          </div>

          {/* Referral Code */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 168, 150, 0.08)' }}>
              <Gift size={16} style={{ color: 'var(--accent-teal)' }} />
            </div>
            <input type="text" placeholder="Referral code (optional)" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} className={inputClass} style={inputStyle} />
          </div>

          {/* Terms Checkbox */}
          <label className="flex items-start gap-2.5 mt-1 cursor-pointer">
            <div className="relative mt-0.5">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="sr-only" />
              <div
                className={`w-[18px] h-[18px] rounded border-[1.5px] flex items-center justify-center transition-all duration-200 ${
                  agreed ? 'border-[var(--accent-teal)]' : 'border-[var(--input-border)]'
                }`}
                style={{ backgroundColor: agreed ? 'var(--accent-teal)' : 'transparent' }}
              >
                {agreed && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              I agree to the{' '}
              <span className="font-medium" style={{ color: 'var(--accent-blue)' }}>Privacy Policy</span>
              {' '}and{' '}
              <span className="font-medium" style={{ color: 'var(--accent-blue)' }}>Terms and Conditions</span>
            </span>
          </label>

          {/* Create Account Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full gradient-primary text-white font-semibold text-sm py-3.5 rounded-xl shadow-button mt-1 disabled:opacity-50 cursor-pointer"
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
          >
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </motion.button>
        </form>

        {/* Login Link */}
        <p className="mt-5 text-[13px]" style={{ color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="font-medium cursor-pointer"
            style={{ color: 'var(--accent-blue)' }}
          >
            Login
          </button>
        </p>
      </motion.div>
    </div>
  );
}
