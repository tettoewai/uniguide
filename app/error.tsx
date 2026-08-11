'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/components/providers/locale-provider'

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  const { dict } = useLocale()

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{dict.errorPages.somethingWrong}</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        {dict.errorPages.unexpected}
      </p>
      <div className="flex gap-2">
        <Button onClick={reset}>{dict.common.tryAgain}</Button>
        <Button variant="outline" onClick={() => router.push('/')}>
          {dict.common.goHome}
        </Button>
      </div>
      {process.env.NODE_ENV === 'development' ? (
        <pre className="mt-4 max-w-full overflow-auto rounded-lg bg-muted p-4 text-left text-xs">
          {error.message}
        </pre>
      ) : null}
    </div>
  )
}