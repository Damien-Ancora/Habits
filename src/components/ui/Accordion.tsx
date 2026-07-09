import { useState, type ReactNode } from 'react'

interface Props {
  icon?: string
  title: string
  defaultOpen?: boolean
  children: ReactNode
}

export function Accordion({ icon, title, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-black/6 dark:border-white/8 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 py-3.5 text-left"
      >
        {icon && <span className="text-lg leading-none">{icon}</span>}
        <span className="flex-1 text-sm font-medium">{title}</span>
        <span
          className={`opacity-40 text-lg transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
        >
          +
        </span>
      </button>
      {open && <div className="pb-4 pl-8 pr-1">{children}</div>}
    </div>
  )
}
