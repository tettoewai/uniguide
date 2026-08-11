import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getDictionary } from '@/lib/i18n/server'

export default async function NotFound() {
  const dict = await getDictionary()
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-6xl font-semibold tracking-tight">404</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        {dict.errorPages.notFound}
      </p>
      <Link href="/" className={cn(buttonVariants())}>
        {dict.errorPages.backHome}
      </Link>
    </div>
  )
}