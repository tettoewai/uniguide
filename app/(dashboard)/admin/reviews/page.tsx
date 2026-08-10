import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { AdminNav } from '@/components/admin/AdminNav'
import { ReviewsAdmin } from '@/components/admin/ReviewsAdmin'

export default async function AdminReviewsPage() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true } },
      university: { select: { name: true } },
    },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gradient font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Reviews
        </h1>
        <p className="mt-3 max-w-2xl text-base text-zinc-500">
          Review student feedback and remove inappropriate content.
        </p>
      </div>

      <AdminNav />

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
    </div>
  )
}