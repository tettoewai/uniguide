'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  Home,
  Sparkles,
  Heart,
  Settings,
  LogOut,
  Building2,
  MapPin,
  BookOpen,
  GraduationCap,
  MessageSquareText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logoutUser } from '@/app/actions/auth'
import { useLocale } from '@/components/providers/locale-provider'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { ThemeToggle } from '@/components/ThemeToggle'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'

type Item = { href: string; label: string; icon: typeof Home }

export function MobileHamburger({ isAdmin }: { isAdmin: boolean }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { dict } = useLocale()

  const userNavItems: Item[] = [
    { href: '/dashboard', label: dict.nav.home, icon: Home },
    { href: '/recommendations', label: dict.nav.matches, icon: Sparkles },
    { href: '/favorites', label: dict.nav.saved, icon: Heart },
    { href: '/settings', label: dict.nav.settings, icon: Settings },
  ]

  const adminNavItems: Item[] = [
    { href: '/admin/universities', label: dict.admin.kindsPlural.university, icon: Building2 },
    { href: '/admin/cities', label: dict.admin.kindsPlural.city, icon: MapPin },
    { href: '/admin/subjects', label: dict.admin.kindsPlural.subject, icon: BookOpen },
    { href: '/admin/majors', label: dict.admin.kindsPlural.major, icon: GraduationCap },
    { href: '/admin/hobbies', label: dict.admin.kindsPlural.hobby, icon: Sparkles },
    { href: '/admin/reviews', label: dict.admin.kindsPlural.review, icon: MessageSquareText },
    { href: '/admin/settings', label: dict.nav.settings, icon: Settings },
  ]

  const navItems = isAdmin ? adminNavItems : userNavItems

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label={dict.nav.openMenu}
        className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" showCloseButton={false} className="w-64 p-0">
        <SheetTitle className="sr-only">{dict.nav.navigation}</SheetTitle>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="flex flex-col gap-4 border-t p-4">
          <div className="flex items-center justify-between">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
          <form action={logoutUser}>
            <button
              type="submit"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <LogOut className="size-4" />
              {dict.nav.logout}
            </button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
