import Link from "next/link";
import { auth } from "@/auth";
import { MobileNav } from "@/components/MobileNav";
import { MobileHamburger } from "@/components/MobileHamburger";
import { DesktopNav } from "@/components/DesktopNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/LogoutButton";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";
  const displayName = session?.user?.name ?? session?.user?.email ?? "User";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative min-h-dvh">
      {/* Ambient color orbs */}
      {/* <div
        aria-hidden
        className="pointer-events-none fixed -left-40 -top-40 z-0 size-[32rem] rounded-full bg-sky-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -right-32 top-1/4 z-0 size-[28rem] rounded-full bg-blue-200/30 blur-3xl animate-float-slow"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-0 left-1/3 z-0 size-[24rem] rounded-full bg-cyan-100/40 blur-3xl"
      /> */}

      {/* Transparent glass header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/60 backdrop-blur-xl">
        <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-8">
          <MobileHamburger isAdmin={isAdmin} />

          <Link
            href="/dashboard"
            className="absolute left-1/2 -translate-x-1/2 text-lg font-bold tracking-tight text-foreground md:static md:translate-x-0"
          >
            UniGuide
          </Link>

          <DesktopNav isAdmin={isAdmin} />

          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
            <LogoutButton />
            <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {initials}
            </div>
          </div>
        </div>
      </header>

      <MobileNav isAdmin={isAdmin} />

      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 pb-28 md:pt-10 sm:px-8 md:pb-16 md:pt-14">
        {children}
      </main>
    </div>
  );
}
