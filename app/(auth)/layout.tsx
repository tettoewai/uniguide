import Link from "next/link";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div className="absolute right-6 top-6">
        <LocaleSwitcher />
      </div>
      <Link
        href="/"
        className="text-primary relative mb-6 font-display text-3xl font-bold tracking-tight"
      >
        UniGuide
      </Link>
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}
