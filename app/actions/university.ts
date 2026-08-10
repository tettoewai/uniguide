'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'

export async function toggleFavorite(universityId: string) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const existing = await prisma.favorite.findUnique({
    where: { userId_universityId: { userId: session.user.id, universityId } },
  })

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } })
    return { favorited: false }
  }

  await prisma.favorite.create({
    data: { userId: session.user.id, universityId },
  })
  return { favorited: true }
}

export async function getFavoriteIds(userId: string) {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    select: { universityId: true },
  })
  return new Set(favorites.map((f) => f.universityId))
}