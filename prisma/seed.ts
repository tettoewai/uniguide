import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

async function upsertMany<T extends { id: string; name: string }>(
  upsertFn: (id: string, name: string) => Promise<T>,
  names: { id: string; name: string }[],
) {
  for (const n of names) {
    await upsertFn(n.id, n.name)
  }
}

async function main() {
  const subjects = [
    { id: 'sub-myanmar', name: 'Myanmar' },
    { id: 'sub-english', name: 'English' },
    { id: 'sub-math', name: 'Mathematics' },
    { id: 'sub-chem', name: 'Chemistry' },
    { id: 'sub-physics', name: 'Physics' },
    { id: 'sub-bio', name: 'Biology' },
    { id: 'sub-econ', name: 'Economics' },
  ]
  await upsertMany(
    async (id, name) =>
      prisma.subject.upsert({ where: { id }, update: { name }, create: { id, name } }),
    subjects,
  )

  const hobbies = [
    { id: 'hobby-coding', name: 'Coding', icon: null, color: '#0ea5e9' },
    { id: 'hobby-robotics', name: 'Robotics', icon: null, color: '#0284c7' },
    { id: 'hobby-medical', name: 'Medical Research', icon: null, color: '#ef4444' },
    { id: 'hobby-writing', name: 'Creative Writing', icon: null, color: '#f59e0b' },
    { id: 'hobby-speaking', name: 'Public Speaking', icon: null, color: '#10b981' },
    { id: 'hobby-enviro', name: 'Environmental Science', icon: null, color: '#22c55e' },
  ]
  await upsertMany(
    async (id, name) => {
      const meta = hobbies.find((h) => h.id === id)!
      return prisma.hobby.upsert({
        where: { id },
        update: { name, icon: meta.icon, color: meta.color },
        create: { id, name, icon: meta.icon, color: meta.color },
      })
    },
    hobbies,
  )

  const majors = [
    { id: 'major-cs', name: 'Computer Science (CS)' },
    { id: 'major-mech', name: 'Mechanical Engineering' },
    { id: 'major-medicine', name: 'Medicine (MBBS)' },
    { id: 'major-econ', name: 'Economics' },
    { id: 'major-law', name: 'Law' },
  ]
  await upsertMany(
    async (id, name) =>
      prisma.major.upsert({ where: { id }, update: { name }, create: { id, name } }),
    majors,
  )

  const majorHobbies: Record<string, string[]> = {
    'major-cs': ['hobby-coding', 'hobby-robotics'],
    'major-mech': ['hobby-robotics'],
    'major-medicine': ['hobby-medical', 'hobby-speaking'],
    'major-econ': ['hobby-enviro', 'hobby-speaking'],
    'major-law': ['hobby-speaking', 'hobby-writing'],
  }
  for (const [majorId, hobbyIds] of Object.entries(majorHobbies)) {
    await prisma.majorHobby.deleteMany({ where: { majorId } })
    for (const hobbyId of hobbyIds) {
      await prisma.majorHobby.upsert({
        where: { majorId_hobbyId: { majorId, hobbyId } },
        update: {},
        create: { majorId, hobbyId },
      })
    }
  }

  const universities = [
    {
      id: 'uni-ytu',
      name: 'Yangon Technological University (YTU)',
      city: 'Yangon',
      latitude: 16.8422,
      longitude: 96.1483,
      annualFee: 900_000,
      totalMarkRequired: null,
      majors: ['major-mech', 'major-cs'],
      reqs: { 'sub-math': 60, 'sub-physics': 55, 'sub-english': 55, 'sub-chem': 50 },
    },
    {
      id: 'uni-uit',
      name: 'University of Information Technology (UIT)',
      city: 'Yangon',
      latitude: 16.8984,
      longitude: 96.1842,
      annualFee: 1_100_000,
      totalMarkRequired: null,
      majors: ['major-cs'],
      reqs: { 'sub-math': 65, 'sub-english': 55, 'sub-myanmar': 50 },
    },
    {
      id: 'uni-ucsy',
      name: 'University of Computer Studies, Yangon (UCSY)',
      city: 'Yangon',
      latitude: 16.866,
      longitude: 96.12,
      annualFee: 700_000,
      totalMarkRequired: null,
      majors: ['major-cs'],
      reqs: { 'sub-math': 60, 'sub-english': 50 },
    },
    {
      id: 'uni-med1',
      name: 'University of Medicine (1), Yangon',
      city: 'Yangon',
      latitude: 16.7862,
      longitude: 96.1438,
      annualFee: 2_000_000,
      totalMarkRequired: null,
      majors: ['major-medicine'],
      reqs: { 'sub-bio': 75, 'sub-chem': 70, 'sub-physics': 60, 'sub-english': 65 },
    },
    {
      id: 'uni-dagon',
      name: 'Dagon University',
      city: 'Yangon',
      latitude: 16.9109,
      longitude: 96.1883,
      annualFee: 400_000,
      totalMarkRequired: 50,
      majors: ['major-econ', 'major-law'],
      reqs: {},
    },
    {
      id: 'uni-ygn',
      name: 'University of Yangon',
      city: 'Yangon',
      latitude: 16.8231,
      longitude: 96.134,
      annualFee: 350_000,
      totalMarkRequired: 55,
      majors: ['major-econ', 'major-law'],
      reqs: {},
    },
    {
      id: 'uni-yadanabon',
      name: 'Yadanabon University',
      city: 'Mandalay',
      latitude: 21.924,
      longitude: 96.0961,
      annualFee: 300_000,
      totalMarkRequired: 45,
      majors: ['major-econ', 'major-law'],
      reqs: {},
    },
  ]

  for (const u of universities) {
    await prisma.university.upsert({
      where: { id: u.id },
      update: {
        name: u.name,
        city: u.city,
        latitude: u.latitude,
        longitude: u.longitude,
        annualFee: u.annualFee,
        totalMarkRequired: u.totalMarkRequired,
      },
      create: {
        id: u.id,
        name: u.name,
        city: u.city,
        latitude: u.latitude,
        longitude: u.longitude,
        annualFee: u.annualFee,
        totalMarkRequired: u.totalMarkRequired,
      },
    })

    await prisma.universitySubjectRequirement.deleteMany({ where: { universityId: u.id } })
    for (const [subjectId, minMark] of Object.entries(u.reqs)) {
      await prisma.universitySubjectRequirement.create({
        data: { universityId: u.id, subjectId, minMark },
      })
    }

    await prisma.universityMajor.deleteMany({ where: { universityId: u.id } })
    for (const majorId of u.majors) {
      await prisma.universityMajor.upsert({
        where: { universityId_majorId: { universityId: u.id, majorId } },
        update: {},
        create: { universityId: u.id, majorId },
      })
    }

    await prisma.scholarship.deleteMany({ where: { universityId: u.id } })
    await prisma.scholarship.create({
      data: {
        universityId: u.id,
        name: 'Government Scholarship',
        amount: 300_000,
        type: 'Partial',
      },
    })
  }

  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@uniguide.dev' },
    update: { name: 'UniGuide Admin', role: 'ADMIN' },
    create: {
      name: 'UniGuide Admin',
      email: 'admin@uniguide.dev',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())