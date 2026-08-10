import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-6xl font-semibold tracking-tight">404</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The page you’re looking for doesn’t exist.
      </p>
      <Link href="/" className={cn(buttonVariants())}>
        Back home
      </Link>
    </div>
  )
}