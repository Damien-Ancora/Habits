import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'
import type { AppState } from '../types'

// Default project provided by Damien. The anon/publishable key is safe to ship
// client-side: it only grants what Row Level Security policies allow, and the
// schema (see supabase/schema.sql) restricts every row to its own auth.uid().
const DEFAULT_SUPABASE_URL = 'https://qgttlwkiwfpdxdonqbgy.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFndHRsd2tpd2ZwZHhkb25xYmd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMDM5ODQsImV4cCI6MjA5ODc3OTk4NH0.Sjb0gP6NUY88ECKVW9hL4PdUZ0sBnh7SU6FICBauHyE'

const URL_KEY = 'disimpline-sb-url'
const ANON_KEY = 'disimpline-sb-anon'

export function getSupabaseConfig(): { url: string; anonKey: string } {
  const url = localStorage.getItem(URL_KEY) || DEFAULT_SUPABASE_URL
  const anonKey = localStorage.getItem(ANON_KEY) || DEFAULT_SUPABASE_ANON_KEY
  return { url, anonKey }
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  localStorage.setItem(URL_KEY, url)
  localStorage.setItem(ANON_KEY, anonKey)
}

export function isDefaultConfig(): boolean {
  const { url, anonKey } = getSupabaseConfig()
  return url === DEFAULT_SUPABASE_URL && anonKey === DEFAULT_SUPABASE_ANON_KEY
}

let client: SupabaseClient | null = null
let clientConfigKey = ''

export function getClient(): SupabaseClient {
  const { url, anonKey } = getSupabaseConfig()
  const key = url + anonKey
  if (!client || clientConfigKey !== key) {
    client = createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
    clientConfigKey = key
  }
  return client
}

export async function sendMagicLink(email: string): Promise<{ error: string | null }> {
  const { error } = await getClient().auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.href },
  })
  return { error: error?.message ?? null }
}

export async function signOut() {
  await getClient().auth.signOut()
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await getClient().auth.getUser()
  return data.user ?? null
}

export function onAuthChange(cb: (user: User | null) => void) {
  const { data } = getClient().auth.onAuthStateChange((_event, session) => {
    cb(session?.user ?? null)
  })
  return () => data.subscription.unsubscribe()
}

const TABLE = 'app_state'

export async function pullRemoteState(userId: string): Promise<AppState | null> {
  const { data, error } = await getClient().from(TABLE).select('data').eq('user_id', userId).maybeSingle()
  if (error) {
    console.error('pullRemoteState error', error)
    return null
  }
  return (data?.data as AppState) ?? null
}

export async function pushRemoteState(userId: string, state: AppState): Promise<{ error: string | null }> {
  const { error } = await getClient()
    .from(TABLE)
    .upsert({ user_id: userId, data: state, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
  return { error: error?.message ?? null }
}
