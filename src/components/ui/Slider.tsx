interface Props {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  label?: string;
  showValue?: boolean;
  formatValue?: (v: number) => string;
  accentColor?: string;
}

export function Slider({ min, max, step = 1, value, onChange, label, showValue = true, formatValue, accentColor = '#ef4444' }: Props) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-1.5">
      {(label || showValue) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-gray-300">{label}</span>}
          {showValue && (
            <span className="text-gray-400 font-mono tabular-nums">
              {formatValue ? formatValue(value) : value}
            </span>
          )}
        </div>
      )}
      <div className="relative h-2 rounded-full bg-white/10">
        <div
          className="absolute left-0 top-0 h-2 rounded-full transition-all"
          style={{ width: `${pct}%`, background: accentColor }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
          style={{ margin: 0 }}
        />
      </div>
    </div>
  );
}
