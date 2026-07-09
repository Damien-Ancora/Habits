import { useStore } from '../store/useStore'
import { TRAINING_TYPES, trainingMeta } from '../data/habits'
import { colorFor } from '../lib/colors'
import { Card } from './ui/Card'

interface Props {
  date: string
}

export function TrainingLog({ date }: Props) {
  const trainings = useStore((s) => s.state.entries[date]?.trainings) ?? []
  const addTraining = useStore((s) => s.addTraining)
  const updateTraining = useStore((s) => s.updateTraining)
  const removeTraining = useStore((s) => s.removeTraining)

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="font-semibold text-[15px]">Entraînements du jour</h3>
          <p className="text-xs opacity-60">Ajoute ce que tu as fait</p>
        </div>
        {trainings.length > 0 && (
          <span className="text-xs font-medium shrink-0 px-2 py-1 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400">
            {trainings.length}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {TRAINING_TYPES.map((t) => {
          const c = colorFor(t.color)
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => addTraining(date, t.id)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${c.border} ${c.text} active:scale-95 transition-transform`}
            >
              <span>{t.icon}</span>
              {t.label}
              <span className="opacity-50">+</span>
            </button>
          )
        })}
      </div>

      {trainings.length > 0 && (
        <ul className="flex flex-col gap-2 mt-4">
          {trainings.map((tr) => {
            const meta = trainingMeta(tr.type)
            const c = colorFor(meta.color)
            return (
              <li key={tr.id} className={`rounded-xl border ${c.border} ${c.bgSoft} p-3`}>
                <div className="flex items-center gap-2">
                  <span>{meta.icon}</span>
                  <span className={`text-sm font-medium ${c.text}`}>{meta.label}</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={tr.durationMin ?? ''}
                      onChange={(e) =>
                        updateTraining(date, tr.id, {
                          durationMin: e.target.value === '' ? undefined : Number(e.target.value),
                        })
                      }
                      placeholder="min"
                      className="w-16 rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-2 py-1 text-right text-xs"
                    />
                    <span className="text-xs opacity-50">min</span>
                    <button
                      type="button"
                      onClick={() => removeTraining(date, tr.id)}
                      className="text-xs opacity-40 hover:opacity-80 px-1"
                      aria-label="Supprimer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={tr.note ?? ''}
                  onChange={(e) => updateTraining(date, tr.id, { note: e.target.value })}
                  placeholder="Note (exercices, ressenti, charges…)"
                  className="mt-2 w-full bg-transparent text-sm border-0 border-b border-black/10 dark:border-white/15 focus:border-sky-400 focus:outline-none py-1"
                />
              </li>
            )
          })}
        </ul>
      )}

      <p className="text-[11px] opacity-45 mt-3">🔗 Import Strava automatique — prévu pour une prochaine version.</p>
    </Card>
  )
}
