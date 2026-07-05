import type { HabitCategory } from '../data/habits'
import { colorFor } from '../lib/colors'
import { Card } from './ui/Card'
import { ProgressBar } from './ui/ProgressBar'

interface Props {
  category: HabitCategory
  checks: Record<string, boolean>
  onToggle: (habitId: string) => void
  defaultOpen?: boolean
}

export function CategoryChecklist({ category, checks, onToggle }: Props) {
  const color = colorFor(category.color)
  const done = category.items.filter((i) => checks[i.id]).length
  const total = category.items.length
  const pct = total > 0 ? (done / total) * 100 : 0

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3 mb-1">
        <div>
          <h3 className="font-semibold text-[15px]">{category.title}</h3>
          <p className="text-xs opacity-60">{category.subtitle}</p>
        </div>
        <span className={`text-xs font-medium shrink-0 px-2 py-1 rounded-full ${color.bgSoft} ${color.text}`}>
          {done}/{total}
        </span>
      </div>
      <ProgressBar value={pct} colorHex={color.fill} height={6} trackClassName="mb-3" />
      <ul className="flex flex-col gap-2">
        {category.items.map((item) => {
          const checked = !!checks[item.id]
          return (
            <li key={item.id}>
              <label className="flex items-start gap-2.5 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(item.id)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded"
                />
                <span
                  className={`text-sm leading-snug transition-colors ${
                    checked ? 'opacity-45 line-through' : 'group-hover:opacity-80'
                  }`}
                >
                  {item.label}
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
