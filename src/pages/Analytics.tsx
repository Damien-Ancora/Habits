import { useMemo } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
} from 'recharts'
import { useStore } from '../store/useStore'
import { Card } from '../components/ui/Card'
import { colorFor } from '../lib/colors'
import { averageCategoryCompletion, computeStreaks, dailyCompletionPct } from '../lib/stats'
import { lastNDaysKeys, monthRangeKeys, fromKey } from '../lib/date'
import { NUTRITION_TARGETS } from '../data/habits'

function heatColor(pct: number): string {
  if (pct === 0) return 'rgba(128,128,128,0.12)'
  if (pct < 30) return '#fecaca'
  if (pct < 60) return '#fde68a'
  if (pct < 85) return '#86efac'
  return '#16a34a'
}

export function Analytics() {
  const entries = useStore((s) => s.state.entries)
  const settings = useStore((s) => s.state.settings)

  const monthKeys = useMemo(() => monthRangeKeys(settings), [settings])
  const heatmapKeys = useMemo(() => lastNDaysKeys(42), [])
  const trendKeys = useMemo(() => lastNDaysKeys(21), [])

  const categoryAverages = useMemo(() => averageCategoryCompletion(entries, monthKeys), [entries, monthKeys])
  const streaks = useMemo(() => computeStreaks(monthKeys, entries, 70), [entries, monthKeys])

  const weightSeries = useMemo(
    () =>
      monthKeys
        .filter((k) => entries[k]?.weightKg != null)
        .map((k) => ({ date: fromKey(k).getDate(), poids: entries[k].weightKg })),
    [entries, monthKeys],
  )

  const sleepSeries = useMemo(
    () =>
      trendKeys.map((k) => ({
        date: fromKey(k).getDate(),
        sommeil: entries[k]?.sleepHours ?? null,
      })),
    [entries, trendKeys],
  )

  const wellbeingSeries = useMemo(
    () =>
      trendKeys.map((k) => ({
        date: fromKey(k).getDate(),
        énergie: entries[k]?.energy ?? null,
        mental: entries[k]?.mental ?? null,
        confiance: entries[k]?.confidence ?? null,
      })),
    [entries, trendKeys],
  )

  const macroSeries = useMemo(
    () =>
      trendKeys.map((k) => {
        const e = entries[k]
        const target = e ? NUTRITION_TARGETS[e.dayType] : NUTRITION_TARGETS.entrainement
        return {
          date: fromKey(k).getDate(),
          calories: e?.calories ?? null,
          objectifCalories: target.calories,
          protéines: e?.protein ?? null,
          objectifProtéines: target.protein,
        }
      }),
    [entries, trendKeys],
  )

  const daysLogged = monthKeys.filter((k) => entries[k]).length

  return (
    <div className="flex flex-col gap-4 pb-24">
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{streaks.current}</p>
          <p className="text-xs opacity-60">Streak actuel</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold">{streaks.best}</p>
          <p className="text-xs opacity-60">Meilleur streak</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold">{daysLogged}</p>
          <p className="text-xs opacity-60">Jours suivis</p>
        </Card>
      </div>

      <Card className="p-4">
        <p className="font-semibold text-sm mb-3">Assiduité — 6 dernières semaines</p>
        <div className="grid grid-cols-7 gap-1.5">
          {heatmapKeys.map((k) => {
            const pct = entries[k] ? dailyCompletionPct(entries[k]) : 0
            return (
              <div
                key={k}
                title={`${k}: ${Math.round(pct)}%`}
                className="aspect-square rounded-md"
                style={{ background: heatColor(entries[k] ? pct : 0) }}
              />
            )
          })}
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs opacity-60">
          <span>Moins</span>
          {[0, 20, 45, 70, 95].map((p) => (
            <span key={p} className="h-3 w-3 rounded" style={{ background: heatColor(p) }} />
          ))}
          <span>Plus</span>
        </div>
      </Card>

      <Card className="p-4">
        <p className="font-semibold text-sm mb-3">Complétion moyenne par catégorie (mois)</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={categoryAverages} layout="vertical" margin={{ left: 8, right: 16 }}>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
              type="category"
              dataKey="title"
              width={110}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip formatter={(v) => `${Math.round(Number(v))}%`} />
            <Bar dataKey="pct" radius={[0, 6, 6, 0]}>
              {categoryAverages.map((c) => (
                <Cell key={c.id} fill={colorFor(c.color).fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-4">
        <p className="font-semibold text-sm mb-1">Poids (kg)</p>
        <p className="text-xs opacity-60 mb-3">
          Objectif du mois : {settings.startWeight} → {settings.targetWeight} kg
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weightSeries} margin={{ left: -20, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis
              domain={[
                (dMin: number) => Math.min(dMin, settings.targetWeight ?? dMin) - 1,
                (dMax: number) => Math.max(dMax, settings.startWeight ?? dMax) + 1,
              ]}
              tick={{ fontSize: 11 }}
            />
            <Tooltip />
            {settings.targetWeight && (
              <ReferenceLine y={settings.targetWeight} stroke="#16a34a" strokeDasharray="4 4" label="objectif" />
            )}
            <Line type="monotone" dataKey="poids" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-4">
        <p className="font-semibold text-sm mb-3">Sommeil — 3 dernières semaines</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={sleepSeries} margin={{ left: -20, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <ReferenceLine y={8} stroke="#16a34a" strokeDasharray="4 4" label="8h" />
            <Line type="monotone" dataKey="sommeil" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-4">
        <p className="font-semibold text-sm mb-3">Énergie / mental / confiance</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={wellbeingSeries} margin={{ left: -20, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="énergie" stroke="#f59e0b" strokeWidth={2} dot={false} connectNulls />
            <Line type="monotone" dataKey="mental" stroke="#6366f1" strokeWidth={2} dot={false} connectNulls />
            <Line type="monotone" dataKey="confiance" stroke="#10b981" strokeWidth={2} dot={false} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-4">
        <p className="font-semibold text-sm mb-3">Calories vs objectif</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={macroSeries} margin={{ left: -20, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="calories" stroke="#ef4444" strokeWidth={2} dot={false} connectNulls />
            <Line
              type="monotone"
              dataKey="objectifCalories"
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeWidth={1}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
