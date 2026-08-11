import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  const cities = [
    { id: 'city-naypyidaw', name: 'Naypyidaw', latitude: 19.7633, longitude: 96.0785 },
    { id: 'city-yangon', name: 'Yangon', latitude: 16.8661, longitude: 96.1951 },
    { id: 'city-mandalay', name: 'Mandalay', latitude: 21.9588, longitude: 96.0891 },
    { id: 'city-bago', name: 'Bago', latitude: 17.3369, longitude: 96.4797 },
    { id: 'city-mawlamyine', name: 'Mawlamyine', latitude: 16.4905, longitude: 97.6259 },
    { id: 'city-sittwe', name: 'Sittwe', latitude: 20.1525, longitude: 92.8954 },
    { id: 'city-taunggyi', name: 'Taunggyi', latitude: 20.7836, longitude: 97.0372 },
    { id: 'city-monywa', name: 'Monywa', latitude: 22.1172, longitude: 95.1364 },
    { id: 'city-meiktila', name: 'Meiktila', latitude: 20.8775, longitude: 95.8583 },
    { id: 'city-myitkyina', name: 'Myitkyina', latitude: 25.3842, longitude: 97.3917 },
    { id: 'city-dawei', name: 'Dawei', latitude: 14.0976, longitude: 98.1944 },
    { id: 'city-hpa-an', name: 'Hpa-an', latitude: 16.8907, longitude: 97.6345 },
    { id: 'city-pathein', name: 'Pathein', latitude: 16.7794, longitude: 94.7321 },
    { id: 'city-pyay', name: 'Pyay', latitude: 18.8206, longitude: 95.2167 },
    { id: 'city-lashio', name: 'Lashio', latitude: 22.9369, longitude: 97.7489 },
    { id: 'city-magway', name: 'Magway', latitude: 20.1871, longitude: 94.9303 },
    { id: 'city-sagaing', name: 'Sagaing', latitude: 21.8787, longitude: 95.9614 },
    { id: 'city-loikaw', name: 'Loikaw', latitude: 19.6783, longitude: 97.2117 },
    { id: 'city-hakha', name: 'Hakha', latitude: 22.6394, longitude: 93.5264 },
    { id: 'city-nyaungshwe', name: 'Nyaungshwe', latitude: 20.5594, longitude: 96.9314 },
    { id: 'city-kalay', name: 'Kalay', latitude: 23.2150, longitude: 94.3264 },
    { id: 'city-pakokku', name: 'Pakokku', latitude: 21.3353, longitude: 95.0914 },
    { id: 'city-myingyan', name: 'Myingyan', latitude: 21.6561, longitude: 95.3914 },
    { id: 'city-shwebo', name: 'Shwebo', latitude: 22.5694, longitude: 95.6964 },
    { id: 'city-putao', name: 'Putao', latitude: 27.3231, longitude: 97.3936 },
    { id: 'city-thandwe', name: 'Thandwe', latitude: 18.4644, longitude: 94.3614 },
  ]
  for (const c of cities) {
    await prisma.city.upsert({
      where: { id: c.id },
      update: { name: c.name, latitude: c.latitude, longitude: c.longitude },
      create: { id: c.id, name: c.name, latitude: c.latitude, longitude: c.longitude },
    })
  }

  const subjects = [
    { id: 'sub-myanmar', name: 'Myanmar' },
    { id: 'sub-english', name: 'English' },
    { id: 'sub-math', name: 'Mathematics' },
    { id: 'sub-chem', name: 'Chemistry' },
    { id: 'sub-physics', name: 'Physics' },
    { id: 'sub-bio', name: 'Biology' },
    { id: 'sub-econ', name: 'Economics' },
  ]
  for (const s of subjects) {
    await prisma.subject.upsert({
      where: { id: s.id },
      update: { name: s.name },
      create: { id: s.id, name: s.name },
    })
  }

  const hobbies = [
    { id: 'hobby-coding', name: 'Coding', icon: null, color: '#0ea5e9' },
    { id: 'hobby-robotics', name: 'Robotics', icon: null, color: '#0284c7' },
    { id: 'hobby-medical', name: 'Medical Research', icon: null, color: '#ef4444' },
    { id: 'hobby-writing', name: 'Creative Writing', icon: null, color: '#f59e0b' },
    { id: 'hobby-speaking', name: 'Public Speaking', icon: null, color: '#10b981' },
    { id: 'hobby-enviro', name: 'Environmental Science', icon: null, color: '#22c55e' },
  ]
  for (const h of hobbies) {
    await prisma.hobby.upsert({
      where: { id: h.id },
      update: { name: h.name, icon: h.icon, color: h.color },
      create: { id: h.id, name: h.name, icon: h.icon, color: h.color },
    })
  }

  const majors = [
    { id: 'major-cs', name: 'Computer Science (CS)' },
    { id: 'major-mech', name: 'Mechanical Engineering' },
    { id: 'major-medicine', name: 'Medicine (MBBS)' },
    { id: 'major-econ', name: 'Economics' },
    { id: 'major-law', name: 'Law' },
  ]
  for (const m of majors) {
    await prisma.major.upsert({
      where: { id: m.id },
      update: { name: m.name },
      create: { id: m.id, name: m.name },
    })
  }

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
      cityId: 'city-yangon',
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
      cityId: 'city-yangon',
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
      cityId: 'city-yangon',
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
      cityId: 'city-yangon',
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
      cityId: 'city-yangon',
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
      cityId: 'city-yangon',
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
      cityId: 'city-mandalay',
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
        cityId: u.cityId,
        latitude: u.latitude,
        longitude: u.longitude,
        annualFee: u.annualFee,
        totalMarkRequired: u.totalMarkRequired,
      },
      create: {
        id: u.id,
        name: u.name,
        cityId: u.cityId,
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
