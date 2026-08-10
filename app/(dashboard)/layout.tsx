import Link from "next/link";
import { LogOut } from "lucide-react";
import { auth } from "@/auth";
import { logoutUser } from "@/app/actions/auth";
import { MobileNav } from "@/components/MobileNav";
import { DesktopNav } from "@/components/DesktopNav";

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
      <div
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
      />

      {/* Transparent glass header */}
      <header className="sticky top-0 z-40 border-b border-white/40 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-8">
          <Link
            href="/dashboard"
            className="text-lg font-bold tracking-tight text-zinc-900"
          >
            UniGuide
          </Link>

          <DesktopNav isAdmin={isAdmin} />

          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-sky-300/50">
              {initials}
            </div>
            <form action={logoutUser}>
              <button
                type="submit"
                aria-label="Sign out"
                className="flex size-9 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/70 hover:text-zinc-900"
              >
                <LogOut className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <MobileNav isAdmin={isAdmin} />

      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 pb-28 pt-10 sm:px-8 md:pb-16 md:pt-14">
        {children}
      </main>
    </div>
  );
}
