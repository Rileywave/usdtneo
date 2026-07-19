import { motion } from 'framer-motion';
import { Activity, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section className="w-full flex flex-col items-center pt-28 pb-8 px-4">
      <motion.div
        className="flex flex-col items-center text-center"
        style={{ maxWidth: '600px' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Live Badge */}
        <motion.div variants={itemVariants}>
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: 'rgba(0, 168, 150, 0.1)',
              border: '1px solid rgba(0, 168, 150, 0.2)',
              color: 'var(--success)',
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse-dot" style={{ backgroundColor: 'var(--success)' }} />
            Live on TRC20 · 2026 Edition
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="mt-6 text-5xl sm:text-6xl font-extrabold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          USDT NEO
          <br />
          <span className="gradient-text">Cloud Mining</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mt-4 text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)', maxWidth: '480px' }}
        >
          The most premium way to mine USDT. Secure TRC20 network, daily payouts, transparent tiers — designed like a 2026 fintech app.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="mt-6 flex items-center gap-3">
          <motion.button
            onClick={() => navigate('/register')}
            className="gradient-primary text-white font-semibold text-sm px-7 py-3 rounded-xl shadow-button flex items-center gap-2 cursor-pointer"
            whileHover={{ y: -1, boxShadow: '0 6px 24px rgba(0, 168, 150, 0.35)' }}
            whileTap={{ y: 0 }}
            transition={{ duration: 0.2 }}
          >
            Create Account
            <ArrowRight size={16} />
          </motion.button>
          <motion.button
            onClick={() => navigate('/login')}
            className="bg-white font-medium text-sm px-7 py-3 rounded-xl border cursor-pointer"
            style={{
              borderColor: 'var(--input-border)',
              color: 'var(--text-primary)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}
            whileHover={{
              borderColor: 'var(--accent-teal)',
              boxShadow: '0 4px 12px rgba(0, 168, 150, 0.1)',
            }}
            transition={{ duration: 0.2 }}
          >
            Login
          </motion.button>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          variants={itemVariants}
          className="mt-8 w-full"
          style={{ maxWidth: '400px' }}
        >
          <motion.div
            className="gradient-primary rounded-[20px] p-6 text-white"
            style={{ boxShadow: '0 12px 40px rgba(0, 168, 150, 0.3)' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Available Balance
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold">1,248.52</span>
              <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                USDT
              </span>
            </div>
            <p className="mt-1 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
              ≈ ₦1,994,432.00
            </p>
          </motion.div>
        </motion.div>

        {/* Live Indicator */}
        <motion.div variants={itemVariants} className="mt-4">
          <div
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-medium"
            style={{
              backgroundColor: 'rgba(0, 168, 150, 0.08)',
              border: '1px solid rgba(0, 168, 150, 0.15)',
              color: 'var(--success)',
            }}
          >
            <Activity size={12} />
            Live network · updates every 2s
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
