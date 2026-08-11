'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, BookOpen, GraduationCap, Sparkles, MessageSquareText, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { href: '/admin/universities', label: 'Universities', icon: Building2 },
  { href: '/admin/cities', label: 'Cities', icon: MapPin },
  { href: '/admin/subjects', label: 'Subjects', icon: BookOpen },
  { href: '/admin/majors', label: 'Majors', icon: GraduationCap },
  { href: '/admin/hobbies', label: 'Hobbies', icon: Sparkles },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquareText },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Admin sections"
      className="flex flex-wrap items-center gap-1.5 rounded-full border border-white/50 bg-white/60 p-1.5 shadow-sm backdrop-blur-md"
    >
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all',
              active
                ? 'bg-primary text-primary-foreground shadow-lg shadow-sky-300/50'
                : 'text-zinc-600 hover:bg-white/70 hover:text-zinc-900',
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}