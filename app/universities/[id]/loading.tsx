import { Skeleton } from "@/components/ui/skeleton";

export default function UniversityLoading() {
  return (
    <div className="space-y-10">
      {/* Hero Skeleton (Matching the gradient header) */}
      <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 sm:px-10">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-background/20 blur-3xl" />
        <div className="relative flex flex-col gap-4">
          <Skeleton className="h-8 w-48 rounded-full bg-background/20" />{" "}
          {/* Back button */}
          <Skeleton className="h-12 w-3/4 rounded-xl bg-background/20 sm:h-14" />{" "}
          {/* Title */}
          <div className="flex gap-3">
            <Skeleton className="h-8 w-32 rounded-full bg-background/20" />{" "}
            {/* City */}
            <Skeleton className="h-8 w-40 rounded-full bg-background/20" />{" "}
            {/* Fee */}
          </div>
        </div>
      </div>

      {/* Content Grid Skeleton (Glass cards) */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Card 1: Programs */}
          <div className="glass rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl">
            <Skeleton className="mb-4 h-7 w-48 rounded-full" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Card 2: Scholarships */}
          <div className="glass rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl">
            <Skeleton className="mb-4 h-7 w-40 rounded-full" />
            <Skeleton className="h-14 w-full rounded-full" />
            <Skeleton className="mt-2 h-14 w-full rounded-full" />
          </div>

          {/* Card 3: Reviews */}
          <div className="glass rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl">
            <Skeleton className="mb-4 h-7 w-32 rounded-full" />
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="mt-3 h-16 w-full rounded-2xl" />
          </div>
        </div>

        {/* Side Rail Skeleton (Sticky Map + Review Form) */}
        <div className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <div className="glass h-64 w-full rounded-3xl border border-border bg-card/60 p-4 backdrop-blur-xl">
            <Skeleton className="h-full w-full rounded-2xl" />
          </div>
          <div className="glass h-48 w-full rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl">
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="mt-3 h-10 w-full rounded-full" />
            <Skeleton className="mt-3 h-24 w-full rounded-2xl" />
            <Skeleton className="mt-3 h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
