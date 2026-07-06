import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore'
import { Card } from '../components/ui/Card'
import { DayDetail } from '../components/DayDetail'
import { dailyCompletionPct } from '../lib/stats'
import { fromKey, isTodayKey, monthLabel, monthMatrix, shiftMonth, toKey, today } from '../lib/date'

interface Props {
  selectedDate: string
  onSelectDate: (date: string) => void
  onOpenInToday: (date: string) => void
}

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

function heatColor(pct: number, hasData: boolean): string {
  if (!hasData) return 'transparent'
  if (pct === 0) return 'rgba(128,128,128,0.15)'
  if (pct < 30) return '#fecaca'
  if (pct < 60) return '#fde68a'
  if (pct < 85) return '#86efac'
  return '#16a34a'
}

export function Journal({ selectedDate, onSelectDate, onOpenInToday }: Props) {
  const entries = useStore((s) => s.state.entries)
  const now = today()
  const [view, setView] = useState<{ year: number; month0: number }>({
    year: fromKey(selectedDate).getFullYear(),
    month0: fromKey(selectedDate).getMonth(),
  })

  const weeks = useMemo(() => monthMatrix(view.year, view.month0), [view])

  return (
    <div className="flex flex-col gap-4 pb-24">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={() => setView((v) => shiftMonth(v.year, v.month0, -1))}
            className="h-8 w-8 rounded-full border border-black/10 dark:border-white/15 flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Mois précédent"
          >
            ‹
          </button>
          <p className="font-semibold capitalize text-sm">{monthLabel(view.year, view.month0)}</p>
          <button
            type="button"
            onClick={() => setView((v) => shiftMonth(v.year, v.month0, 1))}
            className="h-8 w-8 rounded-full border border-black/10 dark:border-white/15 flex items-center justify-center active:scale-95 transition-transform"
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
                const isSel = key === selectedDate
                const isToday = isTodayKey(key)
                const dayNum = fromKey(key).getDate()
                const future = fromKey(key) > now
                return (
                  <button
                    key={di}
                    type="button"
                    onClick={() => onSelectDate(key)}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs relative transition-all ${
                      isSel ? 'ring-2 ring-emerald-500 font-bold' : ''
                    } ${future ? 'opacity-35' : ''}`}
                    style={{
                      background: heatColor(pct, hasData),
                      color: hasData && pct >= 60 ? '#0b3d1f' : undefined,
                    }}
                  >
                    {dayNum}
                    {isToday && (
                      <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-sky-500" />
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-3 text-[10px] opacity-55">
          <span>Moins</span>
          {[0, 20, 45, 70, 95].map((p) => (
            <span key={p} className="h-3 w-3 rounded" style={{ background: heatColor(p, true) }} />
          ))}
          <span>Plus</span>
          <span className="ml-auto flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" /> aujourd'hui
          </span>
        </div>
      </Card>

      <button
        type="button"
        onClick={() => {
          const t = toKey(now)
          onSelectDate(t)
          setView({ year: now.getFullYear(), month0: now.getMonth() })
        }}
        className="text-xs text-sky-600 dark:text-sky-400 underline underline-offset-2 self-center"
      >
        Revenir à aujourd'hui
      </button>

      <DayDetail date={selectedDate} onOpenInToday={onOpenInToday} />
    </div>
  )
}
