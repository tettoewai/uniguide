import { auth } from "@/auth";
import { MapWrapper } from "@/components/MapWrapper";
import { ReviewForm } from "@/components/ReviewForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import {
  ArrowLeft,
  Award,
  Coins,
  GraduationCap,
  Landmark,
  MapPin,
  Scissors,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

// ---------- Icons for scholarships ----------
const SCHOLARSHIP_ICONS: Record<string, LucideIcon> = {
  merit: Award,
  need: Coins,
  full: GraduationCap,
  partial: Scissors,
};

const SCHOLARSHIP_KEYS = ["full", "merit", "need", "partial"];

function scholarshipIconKey(type: string | null) {
  if (!type) return undefined;
  return SCHOLARSHIP_KEYS.find((key) => type.toLowerCase().includes(key));
}

function ScholarshipIcon({ type }: { type: string | null }) {
  const key = scholarshipIconKey(type);
  const Icon = (key ? SCHOLARSHIP_ICONS[key] : undefined) ?? GraduationCap;
  return <Icon className="size-4" />;
}

// ---------- Main Page Component ----------
export default async function UniversityDetailPage(
  props: PageProps<"/universities/[id]">,
) {
  const { id } = await props.params;

  const [university, session] = await Promise.all([
    prisma.university.findUnique({
      where: { id },
      include: {
        city: true,
        subjectReqs: { include: { subject: true } },
        majors: { include: { major: true } },
        scholarships: true,
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    }),
    auth(),
  ]);

  if (!university) redirect("/");

  const userId = session?.user?.id;
  const myReview = userId
    ? (university.reviews.find((r) => r.userId === userId) ?? null)
    : null;

  const hasCoordinates =
    university.latitude !== null && university.longitude !== null;

  return (
    <div className="space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      {/* ----- HERO HEADER ----- */}
      <header className="relative overflow-hidden rounded-3xl px-6 py-12 shadow-md sm:px-10 sm:py-16">
        <div className="relative z-10">
          <Link
            href="/recommendations"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-sky-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:shadow-md"
          >
            <ArrowLeft className="size-4" />
            Back to recommendations
          </Link>

          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            {university.name}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm">
              <MapPin className="size-4 text-sky-500" />
              {university.city.name}
            </span>
          </div>
        </div>
      </header>

      {/* ----- MAIN GRID ----- */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN – main content */}
        <div className="space-y-8 lg:col-span-2">
          {/* Program & Requirements */}
          <Card className="overflow-hidden border-0 bg-white/80 shadow-lg shadow-sky-100/50 backdrop-blur-sm transition hover:shadow-sky-200/50">
            <CardHeader className="border-b border-sky-100/30 bg-sky-50/50 pb-3">
              <CardTitle className="font-display text-xl font-bold tracking-tight text-gray-800">
                Programs & Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex flex-wrap gap-2">
                {university.majors.map((m) => (
                  <Badge
                    key={m.majorId}
                    variant="secondary"
                    className="rounded-full border-0 bg-sky-100 px-4 py-1.5 font-medium text-sky-700 shadow-sm transition hover:bg-sky-200"
                  >
                    {m.major.name}
                  </Badge>
                ))}
              </div>

              {university.subjectReqs.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-sky-100/60 bg-white/60">
                  <table className="w-full text-sm">
                    <thead className="bg-sky-50/70">
                      <tr className="text-left text-gray-500">
                        <th className="px-4 py-2 font-medium">Subject</th>
                        <th className="px-4 py-2 font-medium">Min. Mark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {university.subjectReqs.map((req) => (
                        <tr
                          key={req.id}
                          className="border-b border-sky-100/40 last:border-0"
                        >
                          <td className="px-4 py-2.5 font-medium text-gray-700">
                            {req.subject.name}
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="inline-flex min-w-9 items-center justify-center rounded-full bg-sky-100 px-3 py-0.5 text-xs font-bold text-sky-700">
                              {req.minMark}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : university.totalMarkRequired ? (
                <p className="text-sm text-gray-500">
                  Overall average required:{" "}
                  <span className="font-semibold text-sky-600">
                    {university.totalMarkRequired}
                  </span>
                </p>
              ) : null}
            </CardContent>
          </Card>

          {/* Scholarships */}
          {university.scholarships.length > 0 && (
            <Card className="overflow-hidden border-0 bg-white/80 shadow-lg shadow-emerald-100/50 backdrop-blur-sm transition hover:shadow-emerald-200/50">
              <CardHeader className="border-b border-emerald-100/30 bg-emerald-50/50 pb-3">
                <CardTitle className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-gray-800">
                  <Landmark className="size-5 text-emerald-500" />
                  Scholarships
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                {university.scholarships.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-100/60 bg-white/60 px-5 py-3 shadow-sm transition hover:bg-emerald-50/60"
                  >
                    <span className="flex items-center gap-3 text-sm font-medium text-gray-700">
                      <span className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <ScholarshipIcon type={s.type} />
                      </span>
                      {s.name}
                    </span>
                    <span className="rounded-full bg-amber-50 px-3 py-0.5 text-xs font-semibold text-amber-700">
                      {s.type ?? "General"}
                      {s.amount ? ` · ${s.amount.toLocaleString()} MMK` : ""}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Reviews */}
          <Card className="overflow-hidden border-0 bg-white/80 shadow-lg shadow-indigo-100/50 backdrop-blur-sm transition hover:shadow-indigo-200/50">
            <CardHeader className="border-b border-indigo-100/30 bg-indigo-50/50 pb-3">
              <CardTitle className="font-display text-xl font-bold tracking-tight text-gray-800">
                Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {university.reviews.length === 0 ? (
                <p className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-400">
                  No reviews yet. Be the first!
                </p>
              ) : (
                university.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-xl border border-gray-100/60 bg-white/60 px-4 py-3 transition hover:bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">
                        {review.user.name}
                      </span>
                      <span
                        className="text-sm tracking-tight text-amber-400"
                        aria-label={`Rating: ${review.rating} out of 5`}
                      >
                        {"★".repeat(review.rating)}
                        <span className="text-gray-300">
                          {"☆".repeat(5 - review.rating)}
                        </span>
                      </span>
                    </div>
                    {review.comment && (
                      <p className="mt-1 text-sm text-gray-500">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* ----- RIGHT STICKY RAIL ----- */}
        <div className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          {/* Map */}
          {hasCoordinates && (
            <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 p-2 shadow-lg shadow-sky-100/50 backdrop-blur-sm transition hover:shadow-sky-200/50">
              <div className="w-full overflow-hidden rounded-xl">
                <MapWrapper
                  universities={[
                    {
                      id: university.id,
                      name: university.name,
                      latitude: university.latitude!,
                      longitude: university.longitude!,
                      score: university.totalMarkRequired ?? 0,
                    },
                  ]}
                />
              </div>
            </div>
          )}

          {/* Review Form */}
          <div className="rounded-2xl border border-gray-200/60 bg-white/80 p-6 shadow-lg shadow-sky-100/50 backdrop-blur-sm transition hover:shadow-sky-200/50">
            <ReviewForm
              universityId={university.id}
              isLoggedIn={Boolean(session?.user?.id)}
              existingReview={myReview}
            />
          </div>
        </div>
      </div>

      {/* ----- FOOTER LOGIN PROMPT ----- */}
      {!session?.user && (
        <div className="rounded-2xl border border-sky-100/60 bg-sky-50/60 p-6 text-center backdrop-blur-sm">
          <p className="text-sm text-gray-600">
            <Link
              href="/login"
              className="inline-flex items-center rounded-full bg-sky-600 px-5 py-2 font-medium text-white shadow-md shadow-sky-300/50 transition hover:bg-sky-700 hover:shadow-lg"
            >
              Sign in
            </Link>{" "}
            to save this university or leave a review.
          </p>
        </div>
      )}
    </div>
  );
}
