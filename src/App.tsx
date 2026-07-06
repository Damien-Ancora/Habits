import { useEffect, useState } from 'react'
import { Today } from './pages/Today'
import { Nutrition } from './pages/Nutrition'
import { Journal } from './pages/Journal'
import { Analytics } from './pages/Analytics'
import { Program } from './pages/Program'
import { Settings } from './pages/Settings'
import { useSupabaseSync } from './hooks/useSupabaseSync'
import { toKey, today } from './lib/date'

type Tab = 'today' | 'nutrition' | 'journal' | 'analytics' | 'program' | 'settings'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'today', label: "Aujourd’hui", icon: '✓' },
  { id: 'nutrition', label: 'Nutrition', icon: '🍽' },
  { id: 'journal', label: 'Journal', icon: '📅' },
  { id: 'analytics', label: 'Stats', icon: '📊' },
  { id: 'program', label: 'Programme', icon: '📘' },
  { id: 'settings', label: 'Partage', icon: '⚙' },
]

const STATUS_DOT: Record<string, string> = {
  'local-only': 'bg-amber-500',
  connecting: 'bg-gray-400',
  syncing: 'bg-sky-500 animate-pulse',
  synced: 'bg-emerald-500',
  error: 'bg-rose-500',
}

export default function App() {
  const [tab, setTab] = useState<Tab>('today')
  const [date, setDate] = useState(toKey(today()))
  const [journalDate, setJournalDate] = useState(toKey(today()))
  const sync = useSupabaseSync()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [tab])

  function openInToday(d: string) {
    setDate(d)
    setTab('today')
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row max-w-5xl mx-auto">
      <nav className="hidden md:flex md:flex-col md:w-56 md:shrink-0 p-4 gap-1 border-r border-black/8 dark:border-white/10">
        <div className="flex items-center gap-2 px-2 py-3">
          <span className={`h-2 w-2 rounded-full ${STATUS_DOT[sync.status]}`} />
          <p className="font-bold tracking-tight">DiSIMpline</p>
        </div>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
              tab === t.id ? 'bg-emerald-500 text-white' : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-75'
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>

      <header className="md:hidden flex items-center justify-between px-4 pt-4 pb-2">
        <p className="font-bold tracking-tight">DiSIMpline</p>
        <span className={`h-2 w-2 rounded-full ${STATUS_DOT[sync.status]}`} />
      </header>

      <main className="flex-1 px-4 pt-2 md:pt-6 md:px-6 max-w-2xl w-full mx-auto">
        {tab === 'today' && <Today date={date} onChangeDate={setDate} />}
        {tab === 'nutrition' && <Nutrition date={date} onChangeDate={setDate} />}
        {tab === 'journal' && (
          <Journal selectedDate={journalDate} onSelectDate={setJournalDate} onOpenInToday={openInToday} />
        )}
        {tab === 'analytics' && <Analytics />}
        {tab === 'program' && <Program />}
        {tab === 'settings' && <Settings sync={sync} />}
      </main>

      <nav className="md:hidden fixed bottom-0 inset-x-0 border-t border-black/8 dark:border-white/10 bg-white/90 dark:bg-[#0e0f13]/90 backdrop-blur grid grid-cols-6 no-print">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex flex-col items-center gap-0.5 py-2.5 text-[9px] font-medium transition-colors ${
              tab === t.id ? 'text-emerald-600 dark:text-emerald-400' : 'opacity-50'
            }`}
          >
            <span className="text-base leading-none">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
