import { useStore } from '../store/useStore'
import { HABIT_CATEGORIES, ALL_HABIT_IDS } from '../data/habits'
import { CategoryChecklist } from '../components/CategoryChecklist'
import { DateNav } from '../components/DateNav'
import { Card } from '../components/ui/Card'
import { ProgressBar } from '../components/ui/ProgressBar'
import { RatingDots } from '../components/ui/RatingDots'
import { getPhase, isSunday, weekIndexForKey } from '../lib/date'

interface Props {
  date: string
  onChangeDate: (date: string) => void
}

export function Today({ date, onChangeDate }: Props) {
  const settings = useStore((s) => s.state.settings)
  const entry = useStore((s) => s.state.entries[date])
  const toggleCheck = useStore((s) => s.toggleCheck)
  const setDayType = useStore((s) => s.setDayType)
  const updateEntry = useStore((s) => s.updateEntry)

  const checks = entry?.checks ?? {}
  const dayType = entry?.dayType ?? 'entrainement'
  const done = ALL_HABIT_IDS.filter((id) => checks[id]).length
  const pct = (done / ALL_HABIT_IDS.length) * 100
  const phase = getPhase(date, settings)
  const weekIdx = weekIndexForKey(date, settings)
  const sunday = isSunday(date)

  return (
    <div className="flex flex-col gap-4 pb-24">
      <DateNav date={date} onChange={onChangeDate} />

      {phase.id !== 'hors-periode' && (
        <Card className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="font-semibold text-sm">{phase.label}</p>
            {weekIdx > 0 && <span className="text-xs opacity-60 shrink-0 whitespace-nowrap">Semaine {weekIdx}</span>}
          </div>
          <ul className="text-xs opacity-70 list-disc pl-4 flex flex-col gap-0.5">
            {phase.focus.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="font-semibold text-sm">Complétion du jour</p>
          <span className="text-sm font-bold">{Math.round(pct)}%</span>
        </div>
        <ProgressBar value={pct} colorHex="#10b981" height={10} />
        <p className="text-xs opacity-60 mt-2">
          {done}/{ALL_HABIT_IDS.length} habitudes cochées
        </p>
      </Card>

      <Card className="p-4">
        <p className="font-semibold text-sm mb-2">Type de journée</p>
        <div className="flex rounded-xl overflow-hidden border border-black/10 dark:border-white/15">
          <button
            type="button"
            onClick={() => setDayType(date, 'entrainement')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              dayType === 'entrainement' ? 'bg-sky-500 text-white' : 'opacity-60'
            }`}
          >
            Entraînement
          </button>
          <button
            type="button"
            onClick={() => setDayType(date, 'repos')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              dayType === 'repos' ? 'bg-indigo-500 text-white' : 'opacity-60'
            }`}
          >
            Calme / repos
          </button>
        </div>
      </Card>

      <Card className="p-4 flex flex-col gap-4">
        <p className="font-semibold text-sm">Métriques rapides</p>
        <div className="grid grid-cols-2 gap-3">
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
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs opacity-70">Énergie</span>
            <RatingDots value={entry?.energy} onChange={(v) => updateEntry(date, { energy: v })} colorHex="#f59e0b" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs opacity-70">Mental</span>
            <RatingDots value={entry?.mental} onChange={(v) => updateEntry(date, { mental: v })} colorHex="#6366f1" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs opacity-70">Confiance</span>
            <RatingDots value={entry?.confidence} onChange={(v) => updateEntry(date, { confidence: v })} colorHex="#10b981" />
          </div>
        </div>
        <label className="flex flex-col gap-1 text-xs opacity-70">
          Note du jour
          <textarea
            value={entry?.note ?? ''}
            onChange={(e) => updateEntry(date, { note: e.target.value })}
            rows={2}
            className="rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-2.5 py-1.5 text-sm resize-none"
            placeholder="Ce qui a marché, ce qui a merdé..."
          />
        </label>
      </Card>

      {sunday && (
        <Card className="p-4 border-2 border-dashed">
          <p className="font-semibold text-sm mb-1">Bilan du dimanche (5 lignes)</p>
          <p className="text-xs opacity-60 mb-2">Ce qui a marché, ce qui a merdé, pourquoi.</p>
          <textarea
            value={entry?.sundayBilan ?? ''}
            onChange={(e) => updateEntry(date, { sundayBilan: e.target.value })}
            rows={5}
            className="w-full rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-2.5 py-1.5 text-sm resize-none"
          />
        </Card>
      )}

      {HABIT_CATEGORIES.map((cat) => (
        <CategoryChecklist
          key={cat.id}
          category={cat}
          checks={checks}
          onToggle={(habitId) => toggleCheck(date, habitId)}
        />
      ))}
    </div>
  )
}
