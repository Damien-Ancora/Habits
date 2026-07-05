import { useStore } from '../store/useStore'
import { NUTRITION_TARGETS } from '../data/habits'
import { DateNav } from '../components/DateNav'
import { Card } from '../components/ui/Card'
import { DualProgressBar } from '../components/ui/ProgressBar'

interface Props {
  date: string
  onChangeDate: (date: string) => void
}

const MACRO_FIELDS: { key: 'calories' | 'protein' | 'carbs' | 'fat'; label: string; unit: string; color: string }[] = [
  { key: 'calories', label: 'Calories', unit: 'kcal', color: '#ef4444' },
  { key: 'protein', label: 'Protéines', unit: 'g', color: '#10b981' },
  { key: 'carbs', label: 'Glucides', unit: 'g', color: '#f59e0b' },
  { key: 'fat', label: 'Lipides', unit: 'g', color: '#6366f1' },
]

export function Nutrition({ date, onChangeDate }: Props) {
  const entry = useStore((s) => s.state.entries[date])
  const updateEntry = useStore((s) => s.updateEntry)
  const dayType = entry?.dayType ?? 'entrainement'
  const target = NUTRITION_TARGETS[dayType]

  return (
    <div className="flex flex-col gap-4 pb-24">
      <DateNav date={date} onChange={onChangeDate} />

      <Card className="p-4 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30">
        <p className="text-sm font-medium">
          Ajustement : les glucides jour d'entraînement ont été recalibrés de <strong>310g</strong> à{' '}
          <strong>250–300g</strong> (cible {NUTRITION_TARGETS.entrainement.carbs}g), sur consigne de Simon.
        </p>
      </Card>

      <Card className="p-4">
        <p className="font-semibold text-sm mb-3">
          Cibles — jour {dayType === 'entrainement' ? "d'entraînement" : 'calme / repos'}
        </p>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-black/5 dark:border-white/10">
              <td className="py-1.5 opacity-70">Calories</td>
              <td className="py-1.5 text-right font-medium">{target.calories} kcal</td>
            </tr>
            <tr className="border-b border-black/5 dark:border-white/10">
              <td className="py-1.5 opacity-70">Protéines</td>
              <td className="py-1.5 text-right font-medium">{target.protein} g</td>
            </tr>
            <tr className="border-b border-black/5 dark:border-white/10">
              <td className="py-1.5 opacity-70">Glucides</td>
              <td className="py-1.5 text-right font-medium">
                {target.carbsRange[0] === target.carbsRange[1]
                  ? `${target.carbs} g`
                  : `${target.carbsRange[0]}–${target.carbsRange[1]} g`}
              </td>
            </tr>
            <tr>
              <td className="py-1.5 opacity-70">Lipides</td>
              <td className="py-1.5 text-right font-medium">{target.fat} g</td>
            </tr>
          </tbody>
        </table>
      </Card>

      <Card className="p-4">
        <p className="font-semibold text-sm mb-3">Ce que tu as mangé aujourd'hui</p>
        <div className="flex flex-col gap-4">
          {MACRO_FIELDS.map((f) => {
            const value = entry?.[f.key] ?? 0
            const t = f.key === 'calories' ? target.calories : f.key === 'protein' ? target.protein : f.key === 'carbs' ? target.carbs : target.fat
            return (
              <div key={f.key} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="opacity-70">{f.label}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      inputMode="decimal"
                      value={entry?.[f.key] ?? ''}
                      onChange={(e) =>
                        updateEntry(date, { [f.key]: e.target.value === '' ? undefined : Number(e.target.value) })
                      }
                      className="w-20 rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-2 py-1 text-right text-sm"
                      placeholder="0"
                    />
                    <span className="text-xs opacity-50 w-16">
                      / {t} {f.unit}
                    </span>
                  </div>
                </div>
                <DualProgressBar value={value} target={t} colorHex={f.color} />
              </div>
            )
          })}
        </div>
      </Card>

      <Card className="p-4">
        <p className="font-semibold text-sm mb-2">Journée type (jour d'entraînement)</p>
        <ul className="text-sm opacity-75 flex flex-col gap-1.5 list-disc pl-4">
          <li>Pré-séance : avoine + banane + baies + whey + miel</li>
          <li>Post-entraînement : poulet ou bœuf maigre + riz blanc + légumes</li>
          <li>Dîner : bœuf 5% ou poulet + patate douce + grosse portion de légumes</li>
          <li>Snacks : yaourt grec + fruits, poignée d'amandes</li>
        </ul>
      </Card>
    </div>
  )
}
