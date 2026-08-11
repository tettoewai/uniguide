'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useSyncExternalStore } from 'react'
import { cn } from '@/lib/utils'

type Theme = 'system' | 'light' | 'dark'

const themes: Theme[] = ['system', 'light', 'dark']

const icons: Record<Theme, typeof Sun> = {
  system: Monitor,
  light: Sun,
  dark: Moon,
}

const labels: Record<Theme, string> = {
  system: 'Device',
  light: 'Light',
  dark: 'Dark',
}

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()

  if (!mounted) {
    return (
      <button
        className={cn(
          'inline-flex size-9 items-center justify-center rounded-full border border-transparent bg-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
          className,
        )}
        disabled
      >
        <span className="size-4" />
      </button>
    )
  }

  const current = (theme ?? 'system') as Theme
  const currentIndex = themes.indexOf(current)
  const nextTheme = themes[(currentIndex + 1) % themes.length]
  const Icon = icons[current]

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-full border border-transparent bg-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
        className,
      )}
      aria-label={`Theme: ${labels[current]}. Click to switch to ${labels[nextTheme]}`}
      title={labels[current]}
    >
      <Icon className="size-4" />
    </button>
  )
}
