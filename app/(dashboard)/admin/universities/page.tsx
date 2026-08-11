import { prisma } from "@/lib/db";
import { UniversityAdmin } from "@/components/admin/UniversityAdmin";
import { getDictionary } from "@/lib/i18n/server";

export default async function AdminUniversitiesPage() {
  const [universities, majors, subjects, cities] = await Promise.all([
    prisma.university.findMany({
      include: {
        majors: { include: { major: true } },
        subjectReqs: { include: { subject: true } },
        _count: { select: { favorites: true, reviews: true } },
      },
    }),
    prisma.major.findMany({ orderBy: { name: 'asc' } }),
    prisma.subject.findMany({ orderBy: { name: 'asc' } }),
    prisma.city.findMany({ orderBy: { name: 'asc' } }),
  ]);
  const dict = await getDictionary();

  return (
    <>
      <div className="mb-2">
        <h1 className="text-primary font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {dict.admin.universities.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          {dict.admin.universities.subtitle}
        </p>
      </div>

      <UniversityAdmin
        universities={universities.map((u) => ({
          id: u.id,
          name: u.name,
          cityId: u.cityId,
          annualFee: u.annualFee,
          totalMarkRequired: u.totalMarkRequired,
          majors: u.majors.map((m) => m.major.name).join(', '),
          majorIds: u.majors.map((m) => m.majorId),
          subjectReqs: Object.fromEntries(u.subjectReqs.map((r) => [r.subjectId, r.minMark])),
          favorites: u._count.favorites,
          reviews: u._count.reviews,
        }))}
        majors={majors.map((m) => ({ id: m.id, name: m.name }))}
        subjects={subjects.map((s) => ({ id: s.id, name: s.name }))}
        cities={cities.map((c) => ({ id: c.id, name: c.name }))}
      />
    </>
  );
}
