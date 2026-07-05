import type { ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-black/8 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}
