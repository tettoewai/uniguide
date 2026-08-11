import { prisma } from '@/lib/db'
import { ReviewsAdmin } from '@/components/admin/ReviewsAdmin'

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true } },
      university: { select: { name: true } },
    },
  })

  return (
    <>
      <div>
        <h1 className="text-primary font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Reviews
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Review student feedback and remove inappropriate content.
        </p>
      </div>

      <ReviewsAdmin
        reviews={reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt.toISOString(),
          userName: r.user.name,
          universityName: r.university.name,
        }))}
      />
    </>
  )
}
