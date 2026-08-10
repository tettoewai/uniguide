'use client'

import { useActionState, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { addReview, type ReviewFormState } from '@/app/actions/review'

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
            Rate this university
          </CardTitle>
          <CardDescription>Sign in to leave a review.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="glass rounded-3xl">
      <CardHeader>
        <CardTitle className="font-display text-lg font-bold tracking-tight">
          {existingReview ? 'Update your review' : 'Rate this university'}
        </CardTitle>
        <CardDescription>How was the student experience here?</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={(fd) => {
            formAction(fd)
            toast.success('Review saved')
          }}
          className="space-y-4"
        >
          <input type="hidden" name="rating" value={rating} />
          <div>
            <Label>Your rating</Label>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHover(value)}
                  onMouseLeave={() => setHover(rating)}
                  className="text-2xl leading-none transition-all duration-150 hover:scale-110"
                  aria-label={`${value} star${value > 1 ? 's' : ''}`}
                >
                  <span className={value <= (hover || rating) ? 'text-amber-500' : 'text-zinc-300'}>
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">Comment (optional)</Label>
            <Textarea
              id="comment"
              name="comment"
              rows={3}
              placeholder="Campus life, teachers, facilities..."
              defaultValue={existingReview?.comment ?? ''}
              className="rounded-md border-0 bg-white/80 ring-1 ring-zinc-200/70 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-300"
            />
          </div>
          {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
          {state?.success ? <p className="text-sm text-emerald-600">{state.success}</p> : null}
          <Button
            type="submit"
            className="w-full rounded-full bg-primary shadow-lg shadow-sky-300/60 hover:bg-sky-600"
            disabled={isPending || rating === 0}
          >
            {isPending ? 'Saving...' : existingReview ? 'Update review' : 'Submit review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}