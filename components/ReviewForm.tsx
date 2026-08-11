'use client'

import { useActionState, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { addReview, type ReviewFormState } from '@/app/actions/review'
import { useLocale } from '@/components/providers/locale-provider'
import { format } from '@/lib/i18n/config'

type Review = {
  rating: number
  comment: string | null
}

export function ReviewForm({
  universityId,
  isLoggedIn,
  existingReview,
}: {
  universityId: string
  isLoggedIn: boolean
  existingReview: Review | null
}) {
  const { dict } = useLocale()
  const action = addReview.bind(null, universityId)
  const [state, formAction, isPending] = useActionState<ReviewFormState, FormData>(action, {
    error: undefined,
    success: undefined,
  })
  const [rating, setRating] = useState(existingReview?.rating ?? 0)
  const [hover, setHover] = useState(rating)

  if (!isLoggedIn) {
    return (
      <Card className="glass rounded-3xl">
        <CardHeader>
          <CardTitle className="font-display text-lg font-bold tracking-tight">
            {dict.reviewForm.rateTitle}
          </CardTitle>
          <CardDescription>{dict.reviewForm.signInToReview}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="glass rounded-3xl">
      <CardHeader>
        <CardTitle className="font-display text-lg font-bold tracking-tight">
          {existingReview ? dict.reviewForm.updateTitle : dict.reviewForm.rateTitle}
        </CardTitle>
        <CardDescription>{dict.reviewForm.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={(fd) => {
            formAction(fd)
            toast.success(dict.reviewForm.saved)
          }}
          className="space-y-4"
        >
          <input type="hidden" name="rating" value={rating} />
          <div>
            <Label>{dict.reviewForm.yourRating}</Label>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHover(value)}
                  onMouseLeave={() => setHover(rating)}
                  className="text-2xl leading-none transition-all duration-150 hover:scale-110"
                  aria-label={format(
                    value > 1 ? dict.reviewForm.starAriaPlural : dict.reviewForm.starAria,
                    { value },
                  )}
                >
                  <span className={value <= (hover || rating) ? 'text-amber-500' : 'text-muted-foreground'}>
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">{dict.reviewForm.commentLabel}</Label>
            <Textarea
              id="comment"
              name="comment"
              rows={3}
              placeholder={dict.reviewForm.commentPlaceholder}
              defaultValue={existingReview?.comment ?? ''}
              className="rounded-md border-0 bg-background/80 ring-1 ring-border outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-sky-300"
            />
          </div>
          {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
          {state?.success ? <p className="text-sm text-emerald-600">{state.success}</p> : null}
          <Button
            type="submit"
            className="w-full rounded-full bg-primary hover:bg-sky-600"
            disabled={isPending || rating === 0}
          >
            {isPending
              ? dict.reviewForm.saving
              : existingReview
                ? dict.reviewForm.update
                : dict.reviewForm.submit}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}