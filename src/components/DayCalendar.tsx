import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore'
import { dailyCompletionPct } from '../lib/stats'
import { fromKey, isTodayKey, monthLabel, monthMatrix, shiftMonth, toKey, today } from '../lib/date'

interface Props {
  selected: string
  onSelect: (date: string) => void
  onClose: () => void
}

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

function heatColor(pct: number, hasData: boolean): string {
  if (!hasData) return 'transparent'
  if (pct === 0) return 'rgba(128,128,128,0.15)'
  if (pct < 40) return '#fde68a'
  if (pct < 80) return '#86efac'
  return '#16a34a'
}

export function DayCalendar({ selected, onSelect, onClose }: Props) {
  const entries = useStore((s) => s.state.entries)
  const now = today()
  const [view, setView] = useState({
    year: fromKey(selected).getFullYear(),
    month0: fromKey(selected).getMonth(),
  })
  const weeks = useMemo(() => monthMatrix(view.year, view.month0), [view])

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed z-50 left-1/2 top-20 -translate-x-1/2 w-[min(92vw,360px)] rounded-2xl border border-black/10 dark:border-white/12 bg-white dark:bg-[#16171d] shadow-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={() => setView((v) => shiftMonth(v.year, v.month0, -1))}
            className="h-8 w-8 rounded-full border border-black/10 dark:border-white/15 flex items-center justify-center"
            aria-label="Mois précédent"
          >
            ‹
          </button>
          <p className="font-semibold capitalize text-sm">{monthLabel(view.year, view.month0)}</p>
          <button
            type="button"
            onClick={() => setView((v) => shiftMonth(v.year, v.month0, 1))}
            className="h-8 w-8 rounded-full border border-black/10 dark:border-white/15 flex items-center justify-center"
            aria-label="Mois suivant"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map((d, i) => (
            <div key={i} className="text-center text-[10px] font-medium opacity-40">
              {d}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1">
              {week.map((key, di) => {
                if (!key) return <div key={di} />
                const entry = entries[key]
                const hasData = !!entry
                const pct = hasData ? dailyCompletionPct(entry) : 0
                const isSel = key === selected
                const isToday = isTodayKey(key)
                const future = fromKey(key) > now
                return (
                  <button
                    key={di}
                    type="button"
                    onClick={() => {
                      onSelect(key)
                      onClose()
                    }}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs relative ${
                      isSel ? 'ring-2 ring-emerald-500 font-bold' : ''
                    } ${future ? 'opacity-35' : ''}`}
                    style={{
                      background: heatColor(pct, hasData),
                      color: hasData && pct >= 40 ? '#0b3d1f' : undefined,
                    }}
                  >
                    {fromKey(key).getDate()}
                    {isToday && <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-sky-500" />}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            onSelect(toKey(now))
            onClose()
          }}
          className="mt-3 w-full text-xs text-sky-600 dark:text-sky-400 underline underline-offset-2"
        >
          Aujourd'hui
        </button>
      </div>
    </>
  )
}
