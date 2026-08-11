import { auth } from "@/auth";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      marks: { include: { subject: true } },
      hobbies: { include: { hobby: true } },
      preferredCity: true,
    },
  });

  const onboarded = Boolean(
    user &&
    (user.preferredCityId || user.marks.length > 0 || user.hobbies.length > 0),
  );
  if (!onboarded) redirect("/onboarding");

  const universities = await prisma.university.count();

  return (
    <div className="space-y-8">
      <div className="mb-2">
        <h1 className="font-display text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Hi, {session.user.name?.split(" ")[0]}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-zinc-500">
          Here’s a quick overview of your profile.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Annual budget"
          value={
            user?.budget ? `${user.budget.toLocaleString()} MMK` : "Not set"
          }
        />
        <StatCard
          label="Preferred city"
          value={user?.preferredCity?.name ?? "Not set"}
        />
        <StatCard label="Universities tracked" value={String(universities)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CardPanel
          title="Your preferences"
          body={
            user ? (
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">Subjects:</span>{" "}
                  {user.marks.length
                    ? user.marks
                        .map((m) => `${m.subject.name} ${m.mark}`)
                        .join(", ")
                    : "Not set"}
                </li>
                <li>
                  <span className="font-medium text-foreground">Hobbies:</span>{" "}
                  {user.hobbies.length
                    ? user.hobbies.map((h) => h.hobby.name).join(", ")
                    : "Not set"}
                </li>
              </ul>
            ) : null
          }
          action={
            <Link
              href="/onboarding"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Edit preferences
            </Link>
          }
        />
        <CardPanel
          title="Next steps"
          body={
            <p className="text-sm text-muted-foreground">
              See how universities rank against your profile, then save your
              favorites and read reviews from other students.
            </p>
          }
          action={
            <div className="flex gap-2">
              <Link href="/recommendations" className={buttonVariants()}>
                View recommendations
              </Link>
              <Link
                href="/favorites"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Favorites
              </Link>
            </div>
          }
        />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/50 bg-white/60 p-6 shadow-card-soft backdrop-blur-md transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 size-24 rounded-full bg-sky-400/20 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold tabular-nums text-zinc-800">
        {value}
      </p>
    </div>
  );
}

function CardPanel({
  title,
  body,
  action,
}: {
  title: string;
  body: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="space-y-4 rounded-3xl border border-white/50 bg-white/60 p-7 shadow-card-soft backdrop-blur-md">
      <h2 className="font-display text-xl font-bold tracking-tight text-zinc-800">
        {title}
      </h2>
      {body}
      {action}
    </div>
  );
}
