'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Sparkles, Heart, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLocale } from '@/components/providers/locale-provider'

type Item = { href: string; label: string; icon: typeof Home }

export function MobileNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()
  const { dict } = useLocale()

  const userNavItems: Item[] = [
    { href: '/dashboard', label: dict.nav.home, icon: Home },
    { href: '/recommendations', label: dict.nav.matches, icon: Sparkles },
    { href: '/favorites', label: dict.nav.saved, icon: Heart },
    { href: '/settings', label: dict.nav.settings, icon: Settings },
  ]

  if (isAdmin) return null

  return (
    <nav
      aria-label={dict.nav.primary}
      className="fixed inset-x-4 bottom-4 z-50 md:hidden"
    >
      <div className="mx-auto flex max-w-md items-center justify-between gap-1 rounded-full border border-border bg-background/75 p-2 backdrop-blur-xl">
        {userNavItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-all',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}