"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function UniversityError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="glass relative w-full max-w-md overflow-hidden rounded-3xl border border-white/30 bg-white/60 p-8 text-center backdrop-blur-xl shadow-2xl shadow-indigo-500/10">
        {/* Glowing orb in the background */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative z-10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100/80 text-rose-500 shadow-inner">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-zinc-800">
            Couldn’t load this university
          </h1>
          <p className="mt-2 text-sm text-zinc-500">{error.message}</p>
          <Button
            onClick={reset}
            className="mt-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-8 py-2.5 font-medium text-white shadow-lg shadow-indigo-200/60 transition-all hover:scale-[1.02] hover:shadow-indigo-300/80"
          >
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
