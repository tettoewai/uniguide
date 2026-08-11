'use client'

import { LogOut } from 'lucide-react'
import { logoutUser } from '@/app/actions/auth'
import { useLocale } from '@/components/providers/locale-provider'

export function LogoutButton() {
  const { dict } = useLocale()
  return (
    <form action={logoutUser}>
      <button
        type="submit"
        aria-label={dict.nav.logout}
        className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <LogOut className="size-4" />
      </button>
    </form>
  )
}
