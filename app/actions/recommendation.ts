'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'

const EARTH_RADIUS_KM = 6371
const LOCATION_DECAY_KM = 500

function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export type ScoreBreakdown = {
  marks: number
  budget: number
  major: number
  interest: number
  location: number
}

export type RecommendationResult = {
  id: string
  name: string
  cityName: string
  latitude: number | null
  longitude: number | null
  totalMarkRequired: number | null
  majorNames: string[]
  scholarshipName: string | null
  score: number
  breakdown: ScoreBreakdown
}

export async function getWeightedRecommendations(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { marks: { include: { subject: true } }, hobbies: true, preferredCity: true },
  })
  if (!user) return []

  const universities = await prisma.university.findMany({
    include: {
      city: true,
      subjectReqs: { include: { subject: true } },
      majors: { include: { major: { include: { hobbyLinks: { include: { hobby: true } } } } } },
      scholarships: true,
    },
  })

  const userMarkMap = new Map(user.marks.map((m) => [m.subjectId, m.mark]))
  const userHobbyIds = new Set(user.hobbies.map((h) => h.hobbyId))
  const userMajorIds = user.preferredMajors

  const results: RecommendationResult[] = universities.map((uni) => {
    // 1. Mark score (30%)
    let markScore = 0
    if (uni.subjectReqs.length > 0) {
      let totalRatio = 0
      let valid = 0
      for (const req of uni.subjectReqs) {
        const sMark = userMarkMap.get(req.subjectId)
        if (sMark !== undefined) {
          totalRatio += Math.min(1, sMark / req.minMark)
          valid++
        }
      }
      markScore = valid > 0 ? totalRatio / valid : 0
    } else if (uni.totalMarkRequired) {
      const marks = Array.from(userMarkMap.values())
      const avg = marks.length ? marks.reduce((a, b) => a + b, 0) / marks.length : 0
      markScore = Math.min(1, avg / uni.totalMarkRequired)
    }
    const wMark = markScore * 0.3

    // 2. Budget score (25%)
    let budgetFactor = 0.5
    if (uni.annualFee && user.budget) {
      budgetFactor = user.budget >= uni.annualFee ? 1 : user.budget / uni.annualFee
    } else if (uni.annualFee && !user.budget) {
      budgetFactor = 0.5
    }
    const wBudget = budgetFactor * 0.25

    // 3. Major match (20%)
    const uniMajorIds = uni.majors.map((m) => m.majorId)
    let majorScore = 0
    if (userMajorIds.length > 0) {
      majorScore = uniMajorIds.filter((id) => userMajorIds.includes(id)).length / userMajorIds.length
    }
    const wMajor = majorScore * 0.2

    // 4. Interest (15%)
    const uniHobbyIds = new Set<string>()
    uni.majors.forEach((m) => m.major.hobbyLinks.forEach((l) => uniHobbyIds.add(l.hobbyId)))
    let interestScore = 0
    if (userHobbyIds.size > 0) {
      let matches = 0
      uniHobbyIds.forEach((h) => {
        if (userHobbyIds.has(h)) matches++
      })
      interestScore = matches / userHobbyIds.size
    }
    const wInterest = interestScore * 0.15

    // 5. Location (10%)
    let locationScore = 0
    if (user.latitude != null && user.longitude != null && uni.latitude != null && uni.longitude != null) {
      const dist = haversineDistance(user.latitude, user.longitude, uni.latitude, uni.longitude)
      locationScore = Math.max(0, 1 - dist / LOCATION_DECAY_KM)
    } else if (user.preferredCityId && uni.cityId === user.preferredCityId) {
      locationScore = 1
    }
    const wLocation = locationScore * 0.1

    return {
      id: uni.id,
      name: uni.name,
      cityName: uni.city.name,
      latitude: uni.latitude,
      longitude: uni.longitude,
      totalMarkRequired: uni.totalMarkRequired,
      majorNames: uni.majors.map((m) => m.major.name),
      scholarshipName: uni.scholarships[0]?.name ?? null,
      score: wMark + wBudget + wMajor + wInterest + wLocation,
      breakdown: {
        marks: markScore,
        budget: budgetFactor,
        major: majorScore,
        interest: interestScore,
        location: locationScore,
      },
    }
  })

  const sorted = results.sort((a, b) => b.score - a.score)

  await prisma.recommendation.deleteMany({ where: { userId } })
  await prisma.recommendation.createMany({
    data: sorted.map((u) => ({ userId, universityId: u.id, score: u.score })),
  })

  return sorted
}

export async function recomputeRecommendations() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  return getWeightedRecommendations(session.user.id)
}