'use client'

import { Button } from '@/components/ui/button'
import { useLocale } from '@/components/providers/locale-provider'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { dict } = useLocale()

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{dict.errorPages.somethingWrong}</h1>
      <p className="max-w-md text-sm text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>{dict.common.tryAgain}</Button>
    </div>
  )
}