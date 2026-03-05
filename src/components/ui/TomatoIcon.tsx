interface Props {
  size?: number;
  color?: string;
  className?: string;
}

export function TomatoIcon({ size = 16, color = 'currentColor', className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Leaf */}
      <path
        d="M12 4C12 4 10 2 8 3C8 3 9.5 5.5 12 5.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 4C12 4 14 2 16 3C16 3 14.5 5.5 12 5.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="12" y1="4" x2="12" y2="6.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Tomato body */}
      <circle cx="12" cy="14" r="7.5" fill={color} opacity="0.15" />
      <circle cx="12" cy="14" r="7.5" stroke={color} strokeWidth="1.5" />
      {/* Shine */}
      <path
        d="M8.5 10.5C9.5 9.8 10.8 9.5 12 9.5"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
