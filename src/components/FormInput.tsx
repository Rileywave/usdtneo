import type { ReactNode } from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface FormInputProps {
  icon: ReactNode;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function FormInput({
  icon,
  placeholder,
  type = 'text',
  value,
  onChange,
  required = false,
}: FormInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <div
        className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0, 168, 150, 0.08)' }}
      >
        <span style={{ color: 'var(--accent-teal)' }}>{icon}</span>
      </div>
      <motion.input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        className="w-full py-3.5 pl-14 pr-4 rounded-xl text-sm font-normal outline-none transition-all duration-200"
        style={{
          backgroundColor: 'var(--input-bg)',
          border: `1px solid ${focused ? 'var(--accent-teal)' : 'var(--input-border)'}`,
          color: 'var(--text-primary)',
          boxShadow: focused ? '0 0 0 3px rgba(0, 168, 150, 0.1)' : 'none',
        }}
      />
    </div>
  );
}
