import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';

const commissionTiers = [
  { layer: 'Layer 1 · Direct', commission: 12, amount: 842.10, fillPercent: 100 },
  { layer: 'Layer 2', commission: 6, amount: 312.50, fillPercent: 50 },
  { layer: 'Layer 3', commission: 3, amount: 118.20, fillPercent: 25 },
];

const miniStats = [
  { label: 'TOTAL EARNED', value: '1,272.80' },
  { label: 'FRIENDS', value: '248' },
  { label: 'ACTIVE', value: '187' },
];

export default function ReferralSection() {
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
    <section id="referral" className="w-full py-14 px-4 sm:px-6">
      <div className="mx-auto" style={{ maxWidth: '1000px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="p-6 sm:p-10" hover={false}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              {/* Left Column */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {/* Badge */}
                <motion.div variants={itemVariants} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
                  style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)', color: 'var(--accent-teal)' }}
                >
                  <Sparkles size={12} />
                  Referral program
                </motion.div>

                {/* Heading */}
                <motion.h2
                  variants={itemVariants}
                  className="text-2xl sm:text-[28px] font-bold leading-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Earn <span className="gradient-text">12%</span> from every friend
                </motion.h2>

                {/* Description */}
                <motion.p
                  variants={itemVariants}
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Three-level commissions paid instantly to your USDT NEO balance. The more you grow, the more you mine.
                </motion.p>

                {/* Mini Stats */}
                <motion.div variants={itemVariants} className="mt-6 flex items-center gap-3">
                  {miniStats.map((stat, index) => (
                    <div
                      key={index}
                      className="flex-1 glass-card px-3 py-2.5 text-center"
                      style={{ borderRadius: '14px' }}
                    >
                      <p className="text-[10px] font-medium tracking-wide" style={{ color: 'var(--text-muted)' }}>
                        {stat.label}
                      </p>
                      <p className="mt-0.5 text-base font-bold" style={{ color: 'var(--accent-teal)' }}>
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </motion.div>

                {/* CTA */}
                <motion.div variants={itemVariants} className="mt-6">
                  <motion.button
                    onClick={() => navigate('/register')}
                    className="gradient-primary text-white font-semibold text-sm px-7 py-3 rounded-xl shadow-button flex items-center gap-2 cursor-pointer"
                    whileHover={{ y: -1, boxShadow: '0 6px 24px rgba(0, 168, 150, 0.35)' }}
                    whileTap={{ y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    Start earning
                    <ArrowRight size={16} />
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Right Column - Tiers */}
              <motion.div
                className="flex flex-col gap-3"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {commissionTiers.map((tier, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-white rounded-2xl p-4 sm:p-5"
                    style={{ border: '1px solid rgba(0,0,0,0.04)' }}
                  >
                    {/* Top row */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {tier.layer}
                      </span>
                      <span className="text-sm font-bold" style={{ color: 'var(--accent-teal)' }}>
                        +{tier.amount.toFixed(2)} USDT
                      </span>
                    </div>

                    {/* Commission row */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {tier.commission}% commission
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 h-[4px] rounded-full overflow-hidden" style={{ backgroundColor: 'var(--input-bg)' }}>
                      <motion.div
                        className="h-full rounded-full gradient-primary"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${tier.fillPercent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.15 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
