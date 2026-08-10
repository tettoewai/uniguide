import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { getWeightedRecommendations } from '@/app/actions/recommendation'
import { RecommendationCard } from '@/components/RecommendationCard'
import { MapWrapper } from '@/components/MapWrapper'

export default async function RecommendationsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { _count: { select: { marks: true } } },
  })
  if (!user || user._count.marks === 0) redirect('/onboarding')

  const [results, favorites] = await Promise.all([
    getWeightedRecommendations(session.user.id),
    prisma.favorite.findMany({
      where: { userId: session.user.id },
      select: { universityId: true },
    }),
  ])

  const favoriteIds = new Set(favorites.map((f) => f.universityId))

  const withMarkers = results
    .filter((r) => r.latitude !== null && r.longitude !== null)
    .map((r) => ({ id: r.id, name: r.name, latitude: r.latitude!, longitude: r.longitude!, score: r.score }))

  return (
    <div className="space-y-8">
      <div className="mb-2">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-sky-200/70 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600">
          Ranked by your fit
        </span>
        <h1 className="text-gradient font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Your recommendations
        </h1>
        <p className="mt-3 max-w-2xl text-base text-zinc-500">
          Sorted by fit score across marks, budget, majors, interests and location.
        </p>
      </div>

      {withMarkers.length > 0 ? <MapWrapper universities={withMarkers} /> : null}

      <div className="space-y-4">
        {results.map((result, index) => (
          <RecommendationCard
            key={result.id}
            result={result}
            rank={index + 1}
            isFavorite={favoriteIds.has(result.id)}
          />
        ))}
        {results.length === 0 ? (
          <p className="text-sm text-muted-foreground">No universities to show yet.</p>
        ) : null}
      </div>
    </div>
  )
}