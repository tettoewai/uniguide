import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { FavoriteCard } from '@/components/FavoriteCard'

export default async function FavoritesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      university: { include: { city: true, majors: { include: { major: true } } } },
    },
    orderBy: { university: { name: 'asc' } },
  })

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-rose-200/70 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
          Your shortlist
        </span>
        <h1 className="text-gradient font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Your favorites
        </h1>
        <p className="mt-3 max-w-2xl text-base text-zinc-500">
          Universities you’ve saved for later. Hover any card to remove it.
        </p>
      </div>

      {favorites.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You haven’t saved any universities yet.{' '}
          <a href="/recommendations" className="text-primary underline underline-offset-2">
            Browse recommendations
          </a>
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((f) => (
            <FavoriteCard
              key={f.universityId}
              universityId={f.university.id}
              name={f.university.name}
              city={f.university.city.name}
              majors={f.university.majors.map((m) => m.major.name)}
            />
          ))}
        </div>
      )}
    </div>
  )
}