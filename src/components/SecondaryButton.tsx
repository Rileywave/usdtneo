import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SecondaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function SecondaryButton({ children, onClick, className = '' }: SecondaryButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`bg-white font-medium text-sm px-7 py-3 rounded-xl border transition-all duration-200 cursor-pointer ${className}`}
      style={{
        borderColor: 'var(--input-border)',
        color: 'var(--text-primary)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
      whileHover={{
        borderColor: 'var(--accent-teal)',
        boxShadow: '0 4px 12px rgba(0, 168, 150, 0.1)',
      }}
      whileTap={{ y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  );
}
