interface Props {
  radius: number;
  progress: number; // 0 to 1
  strokeWidth: number;
  color: string;
  trailColor?: string;
}

export function ProgressRing({ radius, progress, strokeWidth, color, trailColor = 'rgba(255,255,255,0.08)' }: Props) {
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - progress * circumference;
  const size = radius * 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        fill="none"
        stroke={trailColor}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
      />
    </svg>
  );
}
