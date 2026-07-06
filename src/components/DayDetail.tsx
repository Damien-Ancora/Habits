import { useStore } from '../store/useStore'
import { HABIT_CATEGORIES, NUTRITION_TARGETS } from '../data/habits'
import { colorFor } from '../lib/colors'
import { dailyCompletionPct } from '../lib/stats'
import { formatHuman } from '../lib/date'
import { Card } from './ui/Card'

interface Props {
  date: string
  onOpenInToday?: (date: string) => void
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-black/4 dark:bg-white/5 px-2.5 py-2 text-center">
      <p className="text-sm font-semibold">{value}</p>
      <p className="text-[10px] opacity-55 mt-0.5">{label}</p>
    </div>
  )
}

export function DayDetail({ date, onOpenInToday }: Props) {
  const entry = useStore((s) => s.state.entries[date])

  if (!entry) {
    return (
      <Card className="p-5 text-center">
        <p className="font-semibold capitalize text-sm mb-1">{formatHuman(date)}</p>
        <p className="text-sm opacity-55">Rien d'enregistré ce jour-là.</p>
        {onOpenInToday && (
          <button
            type="button"
            onClick={() => onOpenInToday(date)}
            className="mt-3 text-xs text-sky-600 dark:text-sky-400 underline underline-offset-2"
          >
            Remplir cette journée
          </button>
        )}
      </Card>
    )
  }

  const pct = dailyCompletionPct(entry)
  const target = NUTRITION_TARGETS[entry.dayType]
  const hasMacros = entry.calories != null || entry.protein != null || entry.carbs != null || entry.fat != null
  const plan = entry.dayPlan ?? []

  return (
    <div className="flex flex-col gap-3">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold capitalize text-sm">{formatHuman(date)}</p>
            <p className="text-xs opacity-55">
              {entry.dayType === 'entrainement' ? "Jour d'entraînement" : 'Jour calme / repos'}
            </p>
          </div>
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{Math.round(pct)}%</span>
        </div>
        {onOpenInToday && (
          <button
            type="button"
            onClick={() => onOpenInToday(date)}
            className="mt-2 text-xs text-sky-600 dark:text-sky-400 underline underline-offset-2"
          >
            Modifier cette journée
          </button>
        )}
      </Card>

      {(entry.weightKg != null ||
        entry.sleepHours != null ||
        entry.energy != null ||
        entry.mental != null ||
        entry.confidence != null) && (
        <div className="grid grid-cols-3 gap-2">
          {entry.weightKg != null && <Metric label="Poids" value={`${entry.weightKg} kg`} />}
          {entry.sleepHours != null && <Metric label="Sommeil" value={`${entry.sleepHours} h`} />}
          {entry.energy != null && <Metric label="Énergie" value={`${entry.energy}/5`} />}
          {entry.mental != null && <Metric label="Mental" value={`${entry.mental}/5`} />}
          {entry.confidence != null && <Metric label="Confiance" value={`${entry.confidence}/5`} />}
        </div>
      )}

      {plan.length > 0 && (
        <Card className="p-4">
          <p className="font-semibold text-sm mb-2">Organisation de la journée</p>
          <ul className="flex flex-col gap-1">
            {plan.map((it) => (
              <li key={it.id} className="flex items-center gap-2 text-sm">
                <span>{it.done ? '✓' : '○'}</span>
                <span className={it.done ? 'line-through opacity-45' : ''}>{it.text}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {hasMacros && (
        <Card className="p-4">
          <p className="font-semibold text-sm mb-2">Nutrition</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <Metric label={`/${target.calories}`} value={`${entry.calories ?? 0}`} />
            <Metric label={`/${target.protein}g P`} value={`${entry.protein ?? 0}`} />
            <Metric label={`/${target.carbs}g G`} value={`${entry.carbs ?? 0}`} />
            <Metric label={`/${target.fat}g L`} value={`${entry.fat ?? 0}`} />
          </div>
        </Card>
      )}

      <Card className="p-4">
        <p className="font-semibold text-sm mb-2">Habitudes cochées</p>
        <div className="flex flex-col gap-3">
          {HABIT_CATEGORIES.map((cat) => {
            const checkedItems = cat.items.filter((i) => entry.checks[i.id])
            const color = colorFor(cat.color)
            return (
              <div key={cat.id}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${color.text}`}>{cat.title}</span>
                  <span className="text-xs opacity-50">
                    {checkedItems.length}/{cat.items.length}
                  </span>
                </div>
                {checkedItems.length > 0 && (
                  <ul className="mt-1 flex flex-col gap-0.5">
                    {checkedItems.map((i) => (
                      <li key={i.id} className="text-xs opacity-70 flex gap-1.5">
                        <span className={color.text}>✓</span>
                        {i.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {entry.note && (
        <Card className="p-4">
          <p className="font-semibold text-sm mb-1">Note du jour</p>
          <p className="text-sm opacity-75 whitespace-pre-wrap">{entry.note}</p>
        </Card>
      )}

      {entry.sundayBilan && (
        <Card className="p-4">
          <p className="font-semibold text-sm mb-1">Bilan de la semaine</p>
          <p className="text-sm opacity-75 whitespace-pre-wrap">{entry.sundayBilan}</p>
        </Card>
      )}
    </div>
  )
}
