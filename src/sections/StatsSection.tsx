import { motion } from 'framer-motion';
import { Users, TrendingUp, Zap, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';

interface StatData {
  label: string;
  value: number;
  unit: string;
  decimals: number;
  icon: React.ReactNode;
  fillPercent: number;
}

const initialStats: StatData[] = [
  { label: 'Active miners', value: 84238, unit: '', decimals: 0, icon: <Users size={14} />, fillPercent: 78 },
  { label: 'Mined today', value: 9.42, unit: 'M USDT', decimals: 2, icon: <TrendingUp size={14} />, fillPercent: 65 },
  { label: 'Hash power', value: 5.64, unit: 'PH/s', decimals: 2, icon: <Zap size={14} />, fillPercent: 72 },
  { label: 'Blocks verified', value: 1284908, unit: '', decimals: 0, icon: <ShieldCheck size={14} />, fillPercent: 85 },
];

function formatValue(value: number, decimals: number): string {
  if (decimals === 0) {
    return value.toLocaleString();
  }
  return value.toFixed(decimals);
}

export default function StatsSection() {
  const [stats, setStats] = useState(initialStats);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) =>
        prev.map((stat) => {
          const change = (Math.random() - 0.45) * 0.002 * stat.value;
          return {
            ...stat,
            value: stat.decimals === 0 ? Math.round(stat.value + change) : parseFloat((stat.value + change).toFixed(stat.decimals)),
          };
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const sectionVariants = {
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
    <section id="live-stats" className="w-full py-12 px-4 sm:px-6">
      <div className="mx-auto" style={{ maxWidth: '1200px' }}>
        {/* Section Header */}
        <motion.h2
          className="text-3xl font-bold text-center mb-8"
          style={{ color: 'var(--text-primary)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          Mining the network <span className="gradient-text">in real time</span>
        </motion.h2>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <GlassCard className="p-5" hover={true}>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-blue))' }}
                  >
                    <span className="text-white">{stat.icon}</span>
                  </div>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    {stat.label}
                  </span>
                </div>
                <motion.div
                  className="flex items-baseline gap-1"
                  animate={{ scale: [1, 1.01, 1] }}
                  transition={{ duration: 0.3 }}
                  key={stat.value}
                >
                  <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {formatValue(stat.value, stat.decimals)}
                  </span>
                  {stat.unit && (
                    <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                      {stat.unit}
                    </span>
                  )}
                </motion.div>
                {/* Progress bar */}
                <div className="mt-3 h-[3px] rounded-full overflow-hidden" style={{ backgroundColor: 'var(--input-bg)' }}>
                  <motion.div
                    className="h-full rounded-full gradient-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.fillPercent}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
