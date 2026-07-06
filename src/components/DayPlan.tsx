import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Card } from './ui/Card'

interface Props {
  date: string
}

export function DayPlan({ date }: Props) {
  const items = useStore((s) => s.state.entries[date]?.dayPlan) ?? []
  const addItem = useStore((s) => s.addDayPlanItem)
  const toggleItem = useStore((s) => s.toggleDayPlanItem)
  const updateText = useStore((s) => s.updateDayPlanItemText)
  const removeItem = useStore((s) => s.removeDayPlanItem)
  const [draft, setDraft] = useState('')

  const done = items.filter((i) => i.done).length

  function submit() {
    if (!draft.trim()) return
    addItem(date, draft)
    setDraft('')
  }

  return (
    <Card className="p-4 border-amber-200 dark:border-amber-500/30">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="font-semibold text-[15px]">Organisation de la journée</h3>
          <p className="text-xs opacity-60">3 tâches max — commence par la moins aimée</p>
        </div>
        {items.length > 0 && (
          <span className="text-xs font-medium shrink-0 px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
            {done}/{items.length}
          </span>
        )}
      </div>

      <ul className="flex flex-col gap-1.5 mt-2">
        {items.map((item, idx) => (
          <li key={item.id} className="flex items-center gap-2">
            <span className="text-xs opacity-40 w-4 shrink-0 text-center">{idx + 1}</span>
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => toggleItem(date, item.id)}
              className="h-4 w-4 shrink-0 rounded"
            />
            <input
              type="text"
              value={item.text}
              onChange={(e) => updateText(date, item.id, e.target.value)}
              className={`flex-1 bg-transparent text-sm border-0 border-b border-transparent focus:border-amber-400 focus:outline-none py-0.5 ${
                item.done ? 'line-through opacity-45' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => removeItem(date, item.id)}
              className="text-xs opacity-40 hover:opacity-80 shrink-0 px-1"
              aria-label="Supprimer"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {items.length === 0 && (
        <p className="text-xs opacity-50 mt-2 mb-1">Aucune tâche pour l'instant. Écris ton plan ci-dessous.</p>
      )}

      <div className="flex gap-2 mt-3">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
          }}
          placeholder="Ajouter une tâche…"
          className="flex-1 rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-2.5 py-1.5 text-sm"
        />
        <button
          type="button"
          onClick={submit}
          className="rounded-lg bg-amber-500 text-white text-sm font-medium px-3 py-1.5 active:scale-95 transition-transform"
        >
          +
        </button>
      </div>
    </Card>
  )
}
