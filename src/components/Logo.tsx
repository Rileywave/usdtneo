interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 36, showText = true, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <defs>
          <linearGradient id={`logo-grad-${size}`} x1="0" y1="0" x2="36" y2="36">
            <stop stopColor="#00A896" />
            <stop offset="1" stopColor="#0088CC" />
          </linearGradient>
        </defs>
        <circle cx="18" cy="18" r="18" fill={`url(#logo-grad-${size})`} />
        <path
          d="M18 8L10 12V16C10 21.5 13.3 26.6 18 28C22.7 26.6 26 21.5 26 16V12L18 8Z"
          fill="white"
          fillOpacity="0.95"
        />
        <path
          d="M18 10L12 13.5V16.5C12 20.8 14.5 24.5 18 26C21.5 24.5 24 20.8 24 16.5V13.5L18 10Z"
          fill={`url(#logo-grad-${size})`}
        />
        <text
          x="18"
          y="20.5"
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="700"
          fontFamily="sans-serif"
        >
          T
        </text>
      </svg>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="text-[18px] font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            USDT NEO
          </span>
          <span className="text-[11px] font-normal" style={{ color: 'var(--text-muted)' }}>
            Secure TRC20 Network
          </span>
        </div>
      )}
    </div>
  );
}
