'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Sparkles, Heart, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLocale } from '@/components/providers/locale-provider'

type Item = { href: string; label: string; icon: typeof Home }

export function DesktopNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()
  const { dict } = useLocale()

  const userNavItems: Item[] = [
    { href: '/dashboard', label: dict.nav.dashboard, icon: Home },
    { href: '/recommendations', label: dict.nav.recommendations, icon: Sparkles },
    { href: '/favorites', label: dict.nav.favorites, icon: Heart },
    { href: '/settings', label: dict.nav.settings, icon: Settings },
  ]

  if (isAdmin) return null

  return (
    <nav className="hidden items-center gap-1 md:flex" aria-label={dict.nav.primary}>
      {userNavItems.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}