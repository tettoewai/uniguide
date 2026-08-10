'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'

export type ReviewFormState = { error?: string; success?: string }

export async function addReview(
  universityId: string,
  _prevState: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const parsed = z
    .object({
      rating: z.coerce.number().int().min(1).max(5),
      comment: z.string().max(1000).optional().nullable(),
    })
    .safeParse({
      rating: formData.get('rating'),
      comment: formData.get('comment'),
    })

  if (!parsed.success) {
    return { error: 'Please pick a rating between 1 and 5 stars.' }
  }

  const existing = await prisma.review.findUnique({
    where: {
      userId_universityId: { userId: session.user.id, universityId },
    },
  })

  if (existing) {
    await prisma.review.update({
      where: { id: existing.id },
      data: { rating: parsed.data.rating, comment: parsed.data.comment },
    })
  } else {
    await prisma.review.create({
      data: {
        userId: session.user.id,
        universityId,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
      },
    })
  }

  return { success: 'Thank you — your review was saved.' }
}