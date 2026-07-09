import { startOfISOWeek, addDays } from 'date-fns'
import { useStore } from '../store/useStore'
import { WEEK_PLANS } from '../data/program'
import { fromKey, isoWeekKey, toKey, weekIndexForKey } from '../lib/date'
import { Card } from './ui/Card'

interface Props {
  date: string
}

function avg(nums: (number | undefined)[]): number | null {
  const v = nums.filter((n): n is number => typeof n === 'number')
  if (v.length === 0) return null
  return v.reduce((a, b) => a + b, 0) / v.length
}

export function WeeklyReport({ date }: Props) {
  const weekKey = isoWeekKey(date)
  const settings = useStore((s) => s.state.settings)
  const entries = useStore((s) => s.state.entries)
  const report = useStore((s) => s.state.weeklyReports[weekKey])
  const updateWeeklyReport = useStore((s) => s.updateWeeklyReport)
  const setWeeklyMilestone = useStore((s) => s.setWeeklyMilestone)

  const weekIdx = weekIndexForKey(date, settings)
  const plan = weekIdx > 0 ? WEEK_PLANS[weekIdx - 1] : undefined

  // Days of this ISO week
  const start = startOfISOWeek(fromKey(date))
  const weekKeys = Array.from({ length: 7 }, (_, i) => toKey(addDays(start, i)))
  const days = weekKeys.map((k) => entries[k]).filter(Boolean)

  const weightVals = days.map((d) => d.weightKg).filter((w): w is number => w != null)
  const sleep = avg(days.map((d) => d.sleepHours))
  const energy = avg(days.map((d) => d.energy))
  const mental = avg(days.map((d) => d.mental))
  const confidence = avg(days.map((d) => d.confidence))
  const trainingsCount = days.reduce((n, d) => n + (d.trainings?.length ?? 0), 0)

  const Toggle = ({
    label,
    checked,
    onChange,
  }: {
    label: string
    checked: boolean
    onChange: (v: boolean) => void
  }) => (
    <label className="flex items-center gap-2.5 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded" />
      <span className={`text-sm ${checked ? 'opacity-45 line-through' : ''}`}>{label}</span>
    </label>
  )

  return (
    <Card className="p-4 border-2 border-emerald-300 dark:border-emerald-500/40">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">📅</span>
        <div>
          <h3 className="font-semibold text-[15px]">Rapport de la semaine</h3>
          <p className="text-xs opacity-60">
            {plan ? `${plan.title} — ${plan.subtitle}` : 'Récap de ta semaine'}
          </p>
        </div>
      </div>

      {/* Résumé auto */}
      <div className="grid grid-cols-3 gap-2 my-3">
        <Stat label="Entraînements" value={String(trainingsCount)} />
        <Stat label="Sommeil moy." value={sleep != null ? `${sleep.toFixed(1)}h` : '—'} />
        <Stat
          label="Poids"
          value={weightVals.length ? `${weightVals[weightVals.length - 1]}kg` : '—'}
        />
        <Stat label="Énergie" value={energy != null ? `${energy.toFixed(1)}/5` : '—'} />
        <Stat label="Mental" value={mental != null ? `${mental.toFixed(1)}/5` : '—'} />
        <Stat label="Confiance" value={confidence != null ? `${confidence.toFixed(1)}/5` : '—'} />
      </div>

      {/* Cadre hebdo */}
      <div className="flex flex-col gap-2 py-3 border-t border-black/6 dark:border-white/8">
        <Toggle
          label="Vraie journée de repos complète prise"
          checked={!!report?.restDayTaken}
          onChange={(v) => updateWeeklyReport(weekKey, { restDayTaken: v })}
        />
        <Toggle
          label="Volume allégé (1 matinée en moins) respecté"
          checked={!!report?.lighterWeek}
          onChange={(v) => updateWeeklyReport(weekKey, { lighterWeek: v })}
        />
      </div>

      {/* Jalons du programme */}
      {plan && plan.milestones.length > 0 && (
        <div className="flex flex-col gap-2 py-3 border-t border-black/6 dark:border-white/8">
          <p className="text-xs font-medium opacity-60">Jalons de la semaine</p>
          {plan.milestones.map((m) => {
            const answer = report?.milestones?.[m.id]
            if (m.type === 'check') {
              return (
                <Toggle
                  key={m.id}
                  label={m.label}
                  checked={!!answer}
                  onChange={(v) => setWeeklyMilestone(weekKey, m.id, v)}
                />
              )
            }
            return (
              <label key={m.id} className="flex flex-col gap-1 text-xs">
                <span className="opacity-70">{m.label}</span>
                <input
                  type="text"
                  value={typeof answer === 'string' ? answer : ''}
                  onChange={(e) => setWeeklyMilestone(weekKey, m.id, e.target.value)}
                  className="rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-2 py-1.5"
                />
              </label>
            )
          })}
        </div>
      )}

      {/* Bilan 5 lignes */}
      <div className="pt-3 border-t border-black/6 dark:border-white/8">
        <p className="text-xs font-medium opacity-60 mb-1.5">Bilan (5 lignes) — ce qui a marché, ce qui a merdé, pourquoi</p>
        <textarea
          value={report?.bilan ?? ''}
          onChange={(e) => updateWeeklyReport(weekKey, { bilan: e.target.value })}
          rows={5}
          className="w-full rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-2.5 py-2 text-sm resize-none"
          placeholder="…"
        />
      </div>
    </Card>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-black/4 dark:bg-white/5 px-2 py-2 text-center">
      <p className="text-sm font-semibold">{value}</p>
      <p className="text-[10px] opacity-55 mt-0.5">{label}</p>
    </div>
  )
}
