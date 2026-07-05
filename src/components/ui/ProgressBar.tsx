interface Props {
  value: number // 0-100
  colorHex?: string
  height?: number
  trackClassName?: string
}

export function ProgressBar({ value, colorHex = '#10b981', height = 8, trackClassName = '' }: Props) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      className={`w-full rounded-full bg-black/8 dark:bg-white/10 overflow-hidden ${trackClassName}`}
      style={{ height }}
    >
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${clamped}%`, background: colorHex }}
      />
    </div>
  )
}

export function DualProgressBar({
  value,
  target,
  colorHex = '#10b981',
  height = 10,
}: {
  value: number
  target: number
  colorHex?: string
  height?: number
}) {
  const pct = target > 0 ? (value / target) * 100 : 0
  const over = pct > 100
  return (
    <div className="w-full rounded-full bg-black/8 dark:bg-white/10 overflow-hidden relative" style={{ height }}>
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, pct)}%`, background: over ? '#f59e0b' : colorHex }}
      />
    </div>
  )
}
