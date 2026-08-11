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
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'

type Item = { href: string; label: string; icon: typeof Home }

const userNavItems: Item[] = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/recommendations', label: 'Matches', icon: Sparkles },
  { href: '/favorites', label: 'Saved', icon: Heart },
  { href: '/settings', label: 'Settings', icon: Settings },
]

const adminNavItems: Item[] = [
  { href: '/admin/universities', label: 'Universities', icon: Building2 },
  { href: '/admin/cities', label: 'Cities', icon: MapPin },
  { href: '/admin/subjects', label: 'Subjects', icon: BookOpen },
  { href: '/admin/majors', label: 'Majors', icon: GraduationCap },
  { href: '/admin/hobbies', label: 'Hobbies', icon: Sparkles },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquareText },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function MobileHamburger({ isAdmin }: { isAdmin: boolean }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const navItems = isAdmin ? adminNavItems : userNavItems

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open menu"
        className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" showCloseButton={false} className="w-64 p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
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
        <div className="border-t p-4">
          <form action={logoutUser}>
            <button
              type="submit"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <LogOut className="size-4" />
              Log out
            </button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
