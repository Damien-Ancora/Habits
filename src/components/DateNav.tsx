import { formatHuman, isTodayKey, shiftDay, toKey, today } from '../lib/date'

interface Props {
  date: string
  onChange: (date: string) => void
}

export function DateNav({ date, onChange }: Props) {
  return (
    <div className="flex items-center justify-between gap-2">
      <button
        type="button"
        onClick={() => onChange(shiftDay(date, -1))}
        className="h-9 w-9 rounded-full border border-black/10 dark:border-white/15 flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Jour précédent"
      >
        ‹
      </button>
      <div className="text-center">
        <p className="font-semibold capitalize text-[15px]">{formatHuman(date)}</p>
        {!isTodayKey(date) && (
          <button
            type="button"
            onClick={() => onChange(toKey(today()))}
            className="text-xs text-sky-600 dark:text-sky-400 underline underline-offset-2"
          >
            revenir à aujourd'hui
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(shiftDay(date, 1))}
        className="h-9 w-9 rounded-full border border-black/10 dark:border-white/15 flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Jour suivant"
      >
        ›
      </button>
    </div>
  )
}
