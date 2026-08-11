import { prisma } from "@/lib/db";
import { UniversityAdmin } from "@/components/admin/UniversityAdmin";

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

  return (
    <>
      <div className="mb-2">
        <h1 className="text-primary font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Manage universities
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Add or remove universities, their programs and subject requirements.
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
