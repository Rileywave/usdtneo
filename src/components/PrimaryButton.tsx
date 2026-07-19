import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  showArrow?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export default function PrimaryButton({
  children,
  onClick,
  type = 'button',
  showArrow = false,
  className = '',
  fullWidth = false,
}: PrimaryButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`gradient-primary text-white font-semibold text-sm px-7 py-3 rounded-xl shadow-button flex items-center justify-center gap-2 cursor-pointer ${fullWidth ? 'w-full' : ''} ${className}`}
      whileHover={{ y: -1, boxShadow: '0 6px 24px rgba(0, 168, 150, 0.35)' }}
      whileTap={{ y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
      {showArrow && (
        <motion.span
          className="inline-block"
          initial={{ x: 0 }}
          whileHover={{ x: 3 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowRight size={16} />
        </motion.span>
      )}
    </motion.button>
  );
}
