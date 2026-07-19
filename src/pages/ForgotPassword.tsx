import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AtSign } from 'lucide-react';
import { motion } from 'framer-motion';
import FormInput from '../components/FormInput';
import AuthLayout from '../components/AuthLayout';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Password reset link would be sent to your email');
  };

  return (
    <AuthLayout title="Reset Password" subtitle="We'll email you a secure link">
      <motion.form
        onSubmit={handleSubmit}
        className="glass-card p-8 flex flex-col gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <FormInput
          icon={<AtSign size={18} />}
          placeholder="Your email address"
          type="email"
          value={email}
          onChange={setEmail}
          required
        />
        <motion.button
          type="submit"
          className="gradient-primary text-white font-semibold text-sm py-3.5 rounded-xl shadow-button w-full mt-2 cursor-pointer"
          whileHover={{ y: -1, boxShadow: '0 6px 24px rgba(0, 168, 150, 0.35)' }}
          whileTap={{ y: 0 }}
          transition={{ duration: 0.2 }}
        >
          Send reset link
        </motion.button>
      </motion.form>

      <motion.div
        className="mt-5 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
          Remembered it?{' '}
          <button
            onClick={() => navigate('/login')}
            className="font-medium cursor-pointer hover:underline"
            style={{ color: 'var(--accent-blue)' }}
          >
            Back to login
          </button>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
