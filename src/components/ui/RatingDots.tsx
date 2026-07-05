interface Props {
  value?: number
  max?: number
  onChange: (v: number) => void
  colorHex?: string
}

export function RatingDots({ value = 0, max = 5, onChange, colorHex = '#6366f1' }: Props) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="h-6 w-6 rounded-full border transition-colors"
          style={{
            background: n <= value ? colorHex : 'transparent',
            borderColor: colorHex,
          }}
          aria-label={`${n}/${max}`}
        />
      ))}
    </div>
  )
}
