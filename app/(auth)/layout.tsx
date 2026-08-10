import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none fixed -left-32 -top-32 z-0 size-96 rounded-full bg-sky-200/40 blur-3xl animate-float-slow"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -bottom-24 -right-24 z-0 size-80 rounded-full bg-blue-200/30 blur-3xl"
      />
      <Link
        href="/"
        className="text-gradient relative mb-6 font-display text-3xl font-bold tracking-tight"
      >
        UniGuide
      </Link>
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}
