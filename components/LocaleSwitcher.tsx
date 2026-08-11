'use client'

import { useLocale } from '@/components/providers/locale-provider'
import { cn } from '@/lib/utils'
import type { Locale } from '@/lib/i18n/config'

const options: { value: Locale; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'my', label: 'MY' },
]

export function LocaleSwitcher() {
  const { locale, setLocale, dict } = useLocale()

  return (
    <div
      role="group"
      aria-label={dict.common.language}
      className="inline-flex items-center rounded-full border border-border bg-background/60 p-1"
    >
      {options.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setLocale(value)}
          aria-pressed={locale === value}
          className={cn(
            'inline-flex h-7 items-center rounded-full px-2.5 text-xs font-semibold transition-colors',
            locale === value
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
