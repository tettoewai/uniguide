'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        An unexpected error occurred. You can try again, or go back to the home page.
      </p>
      <div className="flex gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" onClick={() => router.push('/')}>
          Go home
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