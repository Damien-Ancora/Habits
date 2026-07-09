import { Card } from '../components/ui/Card'
import { Accordion } from '../components/ui/Accordion'
import { DISCIPLINE_QUOTE, RESOURCE_GROUPS, RESOURCE_SECTIONS } from '../data/resources'

export function Resources() {
  return (
    <div className="flex flex-col gap-5 pb-24">
      <div className="px-1">
        <p className="text-[11px] uppercase tracking-widest opacity-40">DiSIMpline</p>
        <h1 className="text-xl font-bold tracking-tight">Ressources</h1>
        <p className="text-sm opacity-60 mt-1">
          Ton référentiel : le « comment faire », à consulter quand tu en as besoin. Rien à cocher ici.
        </p>
      </div>

      {RESOURCE_GROUPS.map((group) => {
        const sections = RESOURCE_SECTIONS.filter((s) => s.group === group)
        if (sections.length === 0) return null
        return (
          <div key={group}>
            <h2 className="text-xs font-bold uppercase tracking-wide opacity-50 mb-2 px-1">{group}</h2>
            <Card className="px-4">
              {sections.map((s) => (
                <Accordion key={s.id} icon={s.icon} title={s.title}>
                  <ul className="flex flex-col gap-1.5 list-disc pl-4">
                    {s.points.map((p) => (
                      <li key={p} className="text-sm opacity-75 leading-snug">
                        {p}
                      </li>
                    ))}
                  </ul>
                  {s.note && (
                    <p className="text-xs opacity-55 mt-3 pl-4 border-l-2 border-emerald-400/50 py-1">{s.note}</p>
                  )}
                </Accordion>
              ))}
            </Card>
          </div>
        )
      })}

      <Card className="p-5 bg-black/3 dark:bg-white/5">
        <p className="text-sm italic opacity-75">« {DISCIPLINE_QUOTE} »</p>
        <p className="text-xs opacity-45 mt-2">— Simon Laloux / DiSIMpline</p>
      </Card>
    </div>
  )
}
