import { useState } from 'react'
import { useStore } from '../store/useStore'
import { ALL_HABIT_IDS, HABIT_CATEGORIES } from '../data/habits'
import { CategoryChecklist } from '../components/CategoryChecklist'
import { RoutineChecklist } from '../components/RoutineChecklist'
import { DayCalendar } from '../components/DayCalendar'
import { DayPlan } from '../components/DayPlan'
import { TrainingLog } from '../components/TrainingLog'
import { WeeklyReport } from '../components/WeeklyReport'
import { Card } from '../components/ui/Card'
import { ProgressRing } from '../components/ui/ProgressRing'
import { RatingDots } from '../components/ui/RatingDots'
import {
  formatHuman,
  getPhase,
  isoWeekKey,
  isTodayKey,
  shiftDay,
  weeklyReportVisible,
} from '../lib/date'

interface Props {
  date: string
  onChangeDate: (date: string) => void
  onOpenResources: (ref?: string) => void
}

export function Today({ date, onChangeDate, onOpenResources }: Props) {
  const settings = useStore((s) => s.state.settings)
  const entry = useStore((s) => s.state.entries[date])
  const weeklyReport = useStore((s) => s.state.weeklyReports[isoWeekKey(date)])
  const toggleCheck = useStore((s) => s.toggleCheck)
  const setDayType = useStore((s) => s.setDayType)
  const updateEntry = useStore((s) => s.updateEntry)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const checks = entry?.checks ?? {}
  const dayType = entry?.dayType ?? 'entrainement'
  const done = ALL_HABIT_IDS.filter((id) => checks[id]).length
  const pct = (done / ALL_HABIT_IDS.length) * 100
  const phase = getPhase(date, settings)
  const showWeekly = weeklyReportVisible(date, weeklyReport)

  return (
    <div className="flex flex-col gap-4 pb-24">
      {calendarOpen && (
        <DayCalendar selected={date} onSelect={onChangeDate} onClose={() => setCalendarOpen(false)} />
      )}

      {/* Header: calendar button + date */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => setCalendarOpen(true)}
          className="h-10 w-10 shrink-0 rounded-xl border border-black/10 dark:border-white/15 flex items-center justify-center text-lg active:scale-95 transition-transform"
          aria-label="Ouvrir le calendrier"
        >
          📅
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-semibold capitalize text-[15px] leading-tight truncate">{formatHuman(date)}</p>
          {isTodayKey(date) ? (
            <p className="text-xs opacity-55">Aujourd'hui</p>
          ) : (
            <button
              type="button"
              onClick={() => onChangeDate(new Date().toISOString().slice(0, 10))}
              className="text-xs text-sky-600 dark:text-sky-400 underline underline-offset-2"
            >
              revenir à aujourd'hui
            </button>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onChangeDate(shiftDay(date, -1))}
            className="h-9 w-9 rounded-full border border-black/10 dark:border-white/15 flex items-center justify-center"
            aria-label="Jour précédent"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => onChangeDate(shiftDay(date, 1))}
            className="h-9 w-9 rounded-full border border-black/10 dark:border-white/15 flex items-center justify-center"
            aria-label="Jour suivant"
          >
            ›
          </button>
        </div>
      </div>

      {/* ---------- BILAN DU JOUR (en haut) ---------- */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <ProgressRing value={pct} colorHex="#10b981">
            <div className="text-center">
              <p className="text-lg font-bold leading-none">{Math.round(pct)}%</p>
            </div>
          </ProgressRing>
          <div className="flex-1">
            <p className="font-semibold text-sm">Bilan du jour</p>
            <p className="text-xs opacity-55 mb-2">
              {done}/{ALL_HABIT_IDS.length} coché(s) · {entry?.trainings?.length ?? 0} entraînement(s)
            </p>
            <div className="flex rounded-lg overflow-hidden border border-black/10 dark:border-white/15 text-xs">
              <button
                type="button"
                onClick={() => setDayType(date, 'entrainement')}
                className={`flex-1 py-1.5 font-medium ${dayType === 'entrainement' ? 'bg-sky-500 text-white' : 'opacity-60'}`}
              >
                Entraînement
              </button>
              <button
                type="button"
                onClick={() => setDayType(date, 'repos')}
                className={`flex-1 py-1.5 font-medium ${dayType === 'repos' ? 'bg-indigo-500 text-white' : 'opacity-60'}`}
              >
                Repos
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <label className="flex flex-col gap-1 text-xs opacity-70">
            Poids (kg)
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              value={entry?.weightKg ?? ''}
              onChange={(e) => updateEntry(date, { weightKg: e.target.value === '' ? undefined : Number(e.target.value) })}
              className="rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-2.5 py-1.5 text-sm"
              placeholder={String(settings.startWeight ?? '')}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs opacity-70">
            Sommeil (h)
            <input
              type="number"
              inputMode="decimal"
              step="0.25"
              value={entry?.sleepHours ?? ''}
              onChange={(e) => updateEntry(date, { sleepHours: e.target.value === '' ? undefined : Number(e.target.value) })}
              className="rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-2.5 py-1.5 text-sm"
              placeholder="8"
            />
          </label>
        </div>
        <div className="flex flex-col gap-2.5 mt-3">
          <Row label="Énergie">
            <RatingDots value={entry?.energy} onChange={(v) => updateEntry(date, { energy: v })} colorHex="#f59e0b" />
          </Row>
          <Row label="Mental">
            <RatingDots value={entry?.mental} onChange={(v) => updateEntry(date, { mental: v })} colorHex="#6366f1" />
          </Row>
          <Row label="Confiance">
            <RatingDots value={entry?.confidence} onChange={(v) => updateEntry(date, { confidence: v })} colorHex="#10b981" />
          </Row>
        </div>
        <textarea
          value={entry?.note ?? ''}
          onChange={(e) => updateEntry(date, { note: e.target.value })}
          rows={2}
          className="mt-3 w-full rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-2.5 py-1.5 text-sm resize-none"
          placeholder="Note du jour…"
        />
      </Card>

      {phase.id !== 'hors-periode' && (
        <button
          type="button"
          onClick={() => onOpenResources('phase-thailande')}
          className="text-left"
        >
          <Card className="p-3">
            <p className="text-xs font-medium">{phase.label}</p>
            <p className="text-[11px] opacity-55 mt-0.5">{phase.focus[0]}</p>
          </Card>
        </button>
      )}

      {/* Organisation de la journée */}
      <DayPlan date={date} />

      {/* Entraînements */}
      <TrainingLog date={date} />

      {/* Non-négociables */}
      {HABIT_CATEGORIES.map((cat) => (
        <CategoryChecklist
          key={cat.id}
          category={cat}
          checks={checks}
          onToggle={(habitId) => toggleCheck(date, habitId)}
          onOpenInfo={onOpenResources}
        />
      ))}

      {/* Routines (case unique + détail dépliable) */}
      <RoutineChecklist date={date} onOpenInfo={onOpenResources} />

      {/* Rapport hebdomadaire — seulement sam/dim (ou lundi si pas fait) */}
      {showWeekly ? (
        <WeeklyReport date={date} />
      ) : (
        <p className="text-center text-xs opacity-40 mt-1">
          Le rapport de la semaine s'ouvre le week-end.
        </p>
      )}
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs opacity-70">{label}</span>
      {children}
    </div>
  )
}
