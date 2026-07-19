import { motion } from 'framer-motion';
import { Shield, TrendingUp, Users } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const features = [
  {
    icon: <Shield size={24} />,
    title: 'TRC20 Secured',
    description: 'Funds settle natively on the TRON network — instant, transparent, low fees.',
  },
  {
    icon: <TrendingUp size={24} />,
    title: 'Daily payouts',
    description: 'Earn passive USDT every 24h. Upgrade tiers for higher hash rate.',
  },
  {
    icon: <Users size={24} />,
    title: 'Referral rewards',
    description: 'Earn up to 12% lifetime from your network. Premium tiered commissions.',
  },
];

export default function FeaturesSection() {
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
    <section id="features" className="w-full py-10 px-4 sm:px-6">
      <div className="mx-auto" style={{ maxWidth: '1200px' }}>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <GlassCard className="p-7 h-full" hover={true}>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)' }}
                >
                  <span style={{ color: 'var(--accent-teal)' }}>{feature.icon}</span>
                </div>
                <h3
                  className="mt-4 text-base font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {feature.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
