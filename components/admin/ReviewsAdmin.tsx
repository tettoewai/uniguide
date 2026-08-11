'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Star, Trash2, Check, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteReview } from '@/app/actions/admin'
import { useState } from 'react'
import { useLocale } from '@/components/providers/locale-provider'
import { format } from '@/lib/i18n/config'

type ReviewRow = {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  userName: string
  universityName: string
}

export function ReviewsAdmin({ reviews }: { reviews: ReviewRow[] }) {
  const router = useRouter()
  const { dict } = useLocale()
  const s = dict.admin.reviews
  const [isPending, startTransition] = useTransition()
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const onDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteReview(id)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(s.deleted)
        setConfirmId(null)
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <div className="glass rounded-3xl px-6 py-16 text-center">
          <p className="font-medium text-foreground">{s.emptyTitle}</p>
          <p className="mt-1 text-sm text-muted-foreground">{s.emptyBody}</p>
        </div>
      ) : (
        reviews.map((r) => (
          <article
            key={r.id}
            className="glass rounded-3xl p-6 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-secondary font-semibold text-secondary-foreground">
                  {r.userName.charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="font-semibold text-foreground">{r.userName}</p>
                  <p className="text-sm text-muted-foreground">{r.universityName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}
                    />
                  ))}
                </div>
                {confirmId === r.id ? (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setConfirmId(null)}
                      aria-label={dict.admin.catalog.cancelDeleteAria}
                      className="rounded-full text-muted-foreground"
                    >
                      <X className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onDelete(r.id)}
                      disabled={isPending}
                      aria-label={format(s.confirmDeleteAria, { name: r.userName })}
                      className="rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100"
                    >
                      {isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Check className="size-4" />
                      )}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setConfirmId(r.id)}
                    disabled={isPending}
                    aria-label={format(s.deleteAria, { name: r.userName })}
                    className="rounded-full text-muted-foreground hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            </div>
            {r.comment ? (
              <p className="mt-4 leading-relaxed text-foreground">{r.comment}</p>
            ) : null}
            <p className="mt-3 text-xs text-muted-foreground">
              {new Date(r.createdAt).toLocaleDateString()}
            </p>
          </article>
        ))
      )}
    </div>
  )
}
