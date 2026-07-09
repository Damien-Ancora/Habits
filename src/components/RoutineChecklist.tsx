import { useState } from 'react'
import { ROUTINES } from '../data/habits'
import { colorFor } from '../lib/colors'
import { useStore } from '../store/useStore'
import { Card } from './ui/Card'

interface Props {
  date: string
  onOpenInfo?: (ref: string) => void
}

export function RoutineChecklist({ date, onOpenInfo }: Props) {
  const checks = useStore((s) => s.state.entries[date]?.checks) ?? {}
  const toggleCheck = useStore((s) => s.toggleCheck)
  const [openId, setOpenId] = useState<string | null>(null)

  const done = ROUTINES.filter((r) => checks[r.id]).length

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <h3 className="font-semibold text-[15px]">Routines</h3>
          <p className="text-xs opacity-60">Coche quand c'est fait — déplie pour voir le détail</p>
        </div>
        <span className="text-xs font-medium shrink-0 px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
          {done}/{ROUTINES.length}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {ROUTINES.map((r) => {
          const checked = !!checks[r.id]
          const open = openId === r.id
          const c = colorFor(r.color)
          return (
            <div key={r.id} className={`rounded-xl border ${c.border} overflow-hidden`}>
              <div className={`flex items-center gap-2.5 p-3 ${c.bgSoft}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCheck(date, r.id)}
                  className="h-4 w-4 shrink-0 rounded"
                />
                <span className="text-base leading-none">{r.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium leading-tight ${checked ? 'opacity-45 line-through' : ''}`}>
                    {r.label}
                  </p>
                  <p className="text-[11px] opacity-55">{r.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : r.id)}
                  className="shrink-0 text-xs opacity-60 flex items-center gap-1"
                  aria-expanded={open}
                >
                  détail
                  <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>⌄</span>
                </button>
              </div>

              {open && (
                <div className="px-3 pb-3 pt-1">
                  <ul className="flex flex-col gap-1.5 list-disc pl-5">
                    {r.steps.map((s) => (
                      <li key={s} className="text-xs opacity-75 leading-snug">
                        {s}
                      </li>
                    ))}
                  </ul>
                  {onOpenInfo && (
                    <button
                      type="button"
                      onClick={() => onOpenInfo(r.infoRef)}
                      className={`mt-2 text-[11px] ${c.text} underline underline-offset-2`}
                    >
                      Ouvrir dans Ressources
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
