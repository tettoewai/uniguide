import { auth } from "@/auth";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n/server";
import { format } from "@/lib/i18n/config";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const dict = await getDictionary();

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
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {format(dict.dashboard.greeting, { name: session.user.name?.split(" ")[0] ?? "" })}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          {dict.dashboard.subtitle}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label={dict.dashboard.annualBudget}
          value={
            user?.budget
              ? `${user.budget.toLocaleString()} MMK`
              : dict.dashboard.notSet
          }
        />
        <StatCard
          label={dict.dashboard.preferredCity}
          value={user?.preferredCity?.name ?? dict.dashboard.notSet}
        />
        <StatCard label={dict.dashboard.universitiesTracked} value={String(universities)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CardPanel
          title={dict.dashboard.preferencesTitle}
          body={
            user ? (
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">{dict.dashboard.subjects}</span>{" "}
                  {user.marks.length
                    ? user.marks
                        .map((m) => `${m.subject.name} ${m.mark}`)
                        .join(", ")
                    : dict.dashboard.notSet}
                </li>
                <li>
                  <span className="font-medium text-foreground">{dict.dashboard.hobbies}</span>{" "}
                  {user.hobbies.length
                    ? user.hobbies.map((h) => h.hobby.name).join(", ")
                    : dict.dashboard.notSet}
                </li>
              </ul>
            ) : null
          }
          action={
            <Link
              href="/onboarding"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              {dict.dashboard.editPreferences}
            </Link>
          }
        />
        <CardPanel
          title={dict.dashboard.nextStepsTitle}
          body={
            <p className="text-sm text-muted-foreground">
              {dict.dashboard.nextStepsBody}
            </p>
          }
          action={
            <div className="flex gap-2">
              <Link href="/recommendations" className={buttonVariants()}>
                {dict.dashboard.viewRecommendations}
              </Link>
              <Link
                href="/favorites"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                {dict.dashboard.favorites}
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
    <div className="group relative overflow-hidden rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-md transition-all duration-300 hover:translate-y-[-2px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 size-24 rounded-full bg-sky-400/20 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold tabular-nums text-card-foreground">
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
    <div className="space-y-4 rounded-3xl border border-border bg-card/60 p-7 backdrop-blur-md">
      <h2 className="font-display text-xl font-bold tracking-tight text-card-foreground">
        {title}
      </h2>
      {body}
      {action}
    </div>
  );
}
