import { useState } from 'react'
import { useStore, defaultAppState } from '../store/useStore'
import { Card } from '../components/ui/Card'
import type { useSupabaseSync } from '../hooks/useSupabaseSync'
import { buildShareText } from '../lib/stats'
import { lastNDaysKeys } from '../lib/date'
import type { AppState } from '../types'

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  'local-only': { text: 'Local uniquement (non connecté)', color: 'text-amber-600 dark:text-amber-400' },
  connecting: { text: 'Connexion…', color: 'opacity-60' },
  syncing: { text: 'Synchronisation…', color: 'text-sky-600 dark:text-sky-400' },
  synced: { text: 'Synchronisé', color: 'text-emerald-600 dark:text-emerald-400' },
  error: { text: 'Erreur de synchronisation', color: 'text-rose-600 dark:text-rose-400' },
}

export function Settings({ sync }: { sync: ReturnType<typeof useSupabaseSync> }) {
  const settings = useStore((s) => s.state.settings)
  const updateSettings = useStore((s) => s.updateSettings)
  const replaceState = useStore((s) => s.replaceState)
  const resetAll = useStore((s) => s.resetAll)
  const entries = useStore((s) => s.state.entries)

  const { user, status, lastError, login, logout, syncNow } = sync
  const [email, setEmail] = useState('')
  const [magicSent, setMagicSent] = useState(false)
  const [shareText, setShareText] = useState<string | null>(null)
  const [copyOk, setCopyOk] = useState(false)

  const statusInfo = STATUS_LABEL[status] ?? STATUS_LABEL['local-only']

  async function handleLogin() {
    if (!email) return
    const { error } = await login(email)
    if (!error) setMagicSent(true)
  }

  function handleExport() {
    const data = JSON.stringify(useStore.getState().state, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `disimpline-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as AppState
        replaceState({ ...defaultAppState(), ...parsed, updatedAt: Date.now() })
      } catch {
        alert("Fichier invalide.")
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleGenerateShare() {
    const keys = lastNDaysKeys(7)
    setShareText(buildShareText(entries, keys, 'Bilan des 7 derniers jours'))
    setCopyOk(false)
  }

  async function handleCopy() {
    if (!shareText) return
    await navigator.clipboard.writeText(shareText)
    setCopyOk(true)
  }

  return (
    <div className="flex flex-col gap-4 pb-24">
      <Card className="p-4">
        <p className="font-semibold text-sm mb-2">Synchronisation cloud</p>
        <p className={`text-sm font-medium mb-3 ${statusInfo.color}`}>● {statusInfo.text}</p>
        {user ? (
          <div className="flex flex-col gap-2">
            <p className="text-xs opacity-70">Connecté : {user.email}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={syncNow}
                className="flex-1 rounded-lg bg-sky-500 text-white text-sm font-medium py-2"
              >
                Synchroniser maintenant
              </button>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-black/10 dark:border-white/15 text-sm px-3 py-2"
              >
                Déconnexion
              </button>
            </div>
            {lastError && <p className="text-xs text-rose-500">{lastError}</p>}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-xs opacity-65">
              Connecte-toi avec ton email pour retrouver tes données sur tous tes appareils. Aucun mot de passe : tu
              reçois un lien magique.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              className="rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={handleLogin}
              className="rounded-lg bg-emerald-500 text-white text-sm font-medium py-2"
            >
              Recevoir le lien magique
            </button>
            {magicSent && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                Email envoyé — clique le lien reçu pour te connecter sur cet appareil.
              </p>
            )}
            {lastError && <p className="text-xs text-rose-500">{lastError}</p>}
          </div>
        )}
      </Card>

      <Card className="p-4">
        <p className="font-semibold text-sm mb-3">Programme</p>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-xs opacity-70">
            Année
            <input
              type="number"
              value={settings.programYear}
              onChange={(e) => updateSettings({ programYear: Number(e.target.value) })}
              className="rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-2.5 py-1.5 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs opacity-70">
            Mois (1-12)
            <input
              type="number"
              min={1}
              max={12}
              value={settings.programMonth}
              onChange={(e) => updateSettings({ programMonth: Number(e.target.value) })}
              className="rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-2.5 py-1.5 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs opacity-70">
            Fin phase 1 (jour)
            <input
              type="number"
              value={settings.phase1EndDay}
              onChange={(e) => updateSettings({ phase1EndDay: Number(e.target.value) })}
              className="rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-2.5 py-1.5 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs opacity-70">
            Fin phase 2 (jour)
            <input
              type="number"
              value={settings.phase2EndDay}
              onChange={(e) => updateSettings({ phase2EndDay: Number(e.target.value) })}
              className="rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-2.5 py-1.5 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs opacity-70">
            Poids de départ
            <input
              type="number"
              value={settings.startWeight ?? ''}
              onChange={(e) => updateSettings({ startWeight: Number(e.target.value) })}
              className="rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-2.5 py-1.5 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs opacity-70">
            Poids cible
            <input
              type="number"
              value={settings.targetWeight ?? ''}
              onChange={(e) => updateSettings({ targetWeight: Number(e.target.value) })}
              className="rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-2.5 py-1.5 text-sm"
            />
          </label>
        </div>
      </Card>

      <Card className="p-4">
        <p className="font-semibold text-sm mb-2">Bilan partageable</p>
        <p className="text-xs opacity-65 mb-3">
          Génère un résumé texte des 7 derniers jours à copier-coller (WhatsApp, notes…).
        </p>
        <button
          type="button"
          onClick={handleGenerateShare}
          className="w-full rounded-lg bg-indigo-500 text-white text-sm font-medium py-2 mb-2"
        >
          Générer le bilan de la semaine
        </button>
        {shareText && (
          <div className="flex flex-col gap-2">
            <textarea
              readOnly
              value={shareText}
              rows={10}
              className="w-full rounded-lg border border-black/10 dark:border-white/15 bg-black/3 dark:bg-white/5 px-2.5 py-2 text-xs font-mono"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg border border-black/10 dark:border-white/15 text-sm py-2"
            >
              {copyOk ? 'Copié ✓' : 'Copier'}
            </button>
          </div>
        )}
      </Card>

      <Card className="p-4">
        <p className="font-semibold text-sm mb-2">Sauvegarde locale</p>
        <p className="text-xs opacity-65 mb-3">
          Exporte un fichier de secours ou restaure une sauvegarde — utile même sans compte cloud.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex-1 rounded-lg border border-black/10 dark:border-white/15 text-sm py-2"
          >
            Exporter (.json)
          </button>
          <label className="flex-1 rounded-lg border border-black/10 dark:border-white/15 text-sm py-2 text-center cursor-pointer">
            Importer
            <input type="file" accept="application/json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </Card>

      <Card className="p-4 border-rose-200 dark:border-rose-500/30">
        <p className="font-semibold text-sm mb-2 text-rose-600 dark:text-rose-400">Zone dangereuse</p>
        <button
          type="button"
          onClick={() => {
            if (confirm('Supprimer toutes les données locales ? Cette action est irréversible.')) resetAll()
          }}
          className="w-full rounded-lg border border-rose-300 dark:border-rose-500/40 text-rose-600 dark:text-rose-400 text-sm py-2"
        >
          Réinitialiser toutes les données
        </button>
      </Card>
    </div>
  )
}
