import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Card } from '../components/ui/Card'
import { BLOCS, MONTH_OBJECTIVES, WEEK_PLANS } from '../data/program'
import { getPhase, toKey, today } from '../lib/date'

export function Program() {
  const settings = useStore((s) => s.state.settings)
  const weekMilestones = useStore((s) => s.state.weekMilestones)
  const setWeekMilestone = useStore((s) => s.setWeekMilestone)
  const [openBloc, setOpenBloc] = useState<string | null>(null)

  const currentPhase = getPhase(toKey(today()), settings)

  return (
    <div className="flex flex-col gap-4 pb-24">
      <Card className="p-4">
        <p className="text-xs uppercase tracking-wide opacity-50 mb-1">DiSIMpline — No excuses, just results.</p>
        <h2 className="font-bold text-lg">{MONTH_OBJECTIVES.title}</h2>
        <p className="text-sm opacity-75 mt-2">{MONTH_OBJECTIVES.intro}</p>
        <ul className="text-sm mt-3 flex flex-col gap-1.5 list-disc pl-4 opacity-80">
          {MONTH_OBJECTIVES.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </Card>

      <Card className="p-4">
        <p className="font-semibold text-sm mb-3">Tes 3 priorités</p>
        <div className="flex flex-col gap-3">
          {MONTH_OBJECTIVES.priorities.map((p, i) => (
            <div key={p.title} className="flex gap-3">
              <span className="h-6 w-6 shrink-0 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <p className="font-medium text-sm">{p.title}</p>
                <p className="text-xs opacity-65">{p.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <p className="font-semibold text-sm mb-3">Ta carte du mois</p>
        <div className="flex flex-col gap-3">
          {(['thailande', 'italie', 'retour'] as const).map((id) => {
            const isCurrent = currentPhase.id === id
            const labels: Record<string, { title: string; range: string; points: string[] }> = {
              thailande: {
                title: '1 → 17 juillet — Thaïlande (camp)',
                range: '',
                points: [
                  'Le problème ici : le TROP, pas le trop peu',
                  '1 matinée de Muay Thai en moins/semaine + 1 jour de repos complet',
                  "Sommeil 8h prioritaire",
                  'Nutrition cadrée malgré le volume',
                ],
              },
              italie: {
                title: '17 → 29 juillet — Italie (famille)',
                range: '',
                points: [
                  'Le risque ici : tout lâcher',
                  'Objectif : maintenir, pas performer',
                  '1 activité physique par jour minimum',
                  'Repas famille : protéines + légumes en priorité, zéro culpabilité',
                ],
              },
              retour: {
                title: 'Fin juillet — Retour',
                range: '',
                points: ['Transition vers une prépa structurée', "Cadrage du Mois 2"],
              },
            }
            const p = labels[id]
            return (
              <div
                key={id}
                className={`rounded-xl p-3 border ${
                  isCurrent ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-black/8 dark:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{p.title}</p>
                  {isCurrent && (
                    <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                      en cours
                    </span>
                  )}
                </div>
                <ul className="text-xs opacity-70 mt-1.5 list-disc pl-4 flex flex-col gap-0.5">
                  {p.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </Card>

      <Card className="p-4">
        <p className="font-semibold text-sm mb-3">Semaine par semaine</p>
        <div className="flex flex-col gap-4">
          {WEEK_PLANS.map((w) => (
            <div key={w.index} className="border-b border-black/5 dark:border-white/10 last:border-0 pb-4 last:pb-0">
              <p className="font-medium text-sm">{w.title}</p>
              <p className="text-xs opacity-55 mb-1.5">{w.subtitle}</p>
              <ul className="text-xs opacity-70 list-disc pl-4 flex flex-col gap-0.5 mb-2">
                {w.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
              <div className="flex flex-col gap-1.5">
                {w.milestones.map((m) => {
                  const answer = weekMilestones[String(w.index)]?.[m.id]
                  if (m.type === 'check') {
                    return (
                      <label key={m.id} className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!answer}
                          onChange={(e) => setWeekMilestone(String(w.index), m.id, e.target.checked)}
                        />
                        <span className={answer ? 'line-through opacity-50' : ''}>{m.label}</span>
                      </label>
                    )
                  }
                  return (
                    <label key={m.id} className="flex flex-col gap-1 text-xs">
                      <span className="opacity-70">{m.label}</span>
                      <input
                        type="text"
                        value={typeof answer === 'string' ? answer : ''}
                        onChange={(e) => setWeekMilestone(String(w.index), m.id, e.target.value)}
                        className="rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-2 py-1"
                      />
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <p className="font-semibold text-sm mb-3">Le Système — Blocs de référence</p>
        <div className="flex flex-col gap-2">
          {BLOCS.map((b) => {
            const open = openBloc === b.id
            return (
              <div key={b.id} className="border border-black/8 dark:border-white/10 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenBloc(open ? null : b.id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium"
                >
                  {b.title}
                  <span className="opacity-50">{open ? '−' : '+'}</span>
                </button>
                {open && (
                  <ul className="text-xs opacity-70 list-disc pl-8 pb-3 pr-3 flex flex-col gap-1">
                    {b.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      <Card className="p-4 bg-black/3 dark:bg-white/5">
        <p className="text-sm italic opacity-75">
          « La discipline ce n'est pas faire ce qu'on veut quand on veut. C'est faire ce qu'on a décidé même quand on
          n'en a pas envie. »
        </p>
        <p className="text-xs opacity-50 mt-1">— Simon Laloux / DiSIMpline</p>
      </Card>
    </div>
  )
}
