export default function ScoreGauge({ score, label, size = 110 }) {
  const strokeWidth = 7
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(Math.max(Math.round(score || 0), 0), 100)
  const offset = circumference - (clamped / 100) * circumference
  const color = clamped >= 80 ? '#16A34A' : clamped >= 60 ? '#F59E0B' : '#EF4444'

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)', display: 'block' }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[20px] font-bold text-ink tabular-nums leading-none">
            {clamped}%
          </span>
        </div>
      </div>
      {label && (
        <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted text-center">
          {label}
        </span>
      )}
    </div>
  )
}
