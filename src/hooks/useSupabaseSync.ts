import { useEffect, useRef, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { useStore } from '../store/useStore'
import { getCurrentUser, onAuthChange, pullRemoteState, pushRemoteState, sendMagicLink, signOut } from '../lib/supabase'
import type { AppState } from '../types'

export type SyncStatus = 'local-only' | 'connecting' | 'synced' | 'syncing' | 'error'

export function useSupabaseSync() {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<SyncStatus>('connecting')
  const [lastError, setLastError] = useState<string | null>(null)
  const hasLoadedRemote = useRef(false)
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auth bootstrap + listener
  useEffect(() => {
    let unsub = () => {}
    getCurrentUser()
      .then((u) => {
        setUser(u)
        if (!u) setStatus('local-only')
      })
      .catch(() => setStatus('local-only'))

    unsub = onAuthChange((u) => {
      setUser(u)
      hasLoadedRemote.current = false
      if (!u) setStatus('local-only')
    })
    return unsub
  }, [])

  // Pull remote on login, merge by most-recent updatedAt
  useEffect(() => {
    if (!user || hasLoadedRemote.current) return
    hasLoadedRemote.current = true
    setStatus('syncing')
    pullRemoteState(user.id)
      .then((remote) => {
        const local = useStore.getState().state
        if (remote && remote.updatedAt > local.updatedAt) {
          useStore.getState().replaceState(remote)
        } else {
          return pushRemoteState(user.id, local)
        }
        return undefined
      })
      .then(() => setStatus('synced'))
      .catch((e) => {
        setStatus('error')
        setLastError(String(e))
      })
  }, [user])

  // Push local changes (debounced) whenever state changes and we're authenticated
  useEffect(() => {
    if (!user) return
    const unsub = useStore.subscribe((s) => {
      if (!hasLoadedRemote.current) return
      if (pushTimer.current) clearTimeout(pushTimer.current)
      setStatus('syncing')
      pushTimer.current = setTimeout(() => {
        pushRemoteState(user.id, s.state)
          .then(({ error }) => {
            if (error) {
              setStatus('error')
              setLastError(error)
            } else {
              setStatus('synced')
            }
          })
          .catch((e) => {
            setStatus('error')
            setLastError(String(e))
          })
      }, 1200)
    })
    return unsub
  }, [user])

  async function login(email: string) {
    const { error } = await sendMagicLink(email)
    if (error) setLastError(error)
    return { error }
  }

  async function logout() {
    await signOut()
  }

  async function syncNow() {
    if (!user) return
    setStatus('syncing')
    const local: AppState = useStore.getState().state
    const { error } = await pushRemoteState(user.id, local)
    setStatus(error ? 'error' : 'synced')
    if (error) setLastError(error)
  }

  return { user, status, lastError, login, logout, syncNow }
}
