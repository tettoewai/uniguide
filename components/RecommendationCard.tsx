"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Heart, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleFavorite } from "@/app/actions/university";
import type { RecommendationResult } from "@/app/actions/recommendation";

const SECTIONS: {
  key: keyof RecommendationResult["breakdown"];
  label: string;
  weight: number;
}[] = [
  { key: "marks", label: "Marks", weight: 30 },
  { key: "budget", label: "Budget", weight: 25 },
  { key: "major", label: "Major match", weight: 20 },
  { key: "interest", label: "Interests", weight: 15 },
  { key: "location", label: "Location", weight: 10 },
];

function matchColor(pct: number) {
  if (pct >= 80) return "bg-emerald-500";
  if (pct >= 55) return "bg-amber-500";
  return "bg-rose-500";
}

function matchText(pct: number) {
  if (pct >= 80) return "text-emerald-600";
  if (pct >= 55) return "text-amber-600";
  return "text-rose-600";
}

export function RecommendationCard({
  result,
  rank,
  isFavorite: initialFavorite,
}: {
  result: RecommendationResult;
  rank: number;
  isFavorite: boolean;
}) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isPending, startTransition] = useTransition();
  const scorePct = Math.round(result.score * 100);

  const onToggleFavorite = () => {
    startTransition(async () => {
      const res = await toggleFavorite(result.id);
      setIsFavorite(res.favorited);
      toast.success(
        res.favorited ? "Added to favorites" : "Removed from favorites",
      );
    });
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/40 bg-white/60 p-6 shadow-card-soft backdrop-blur-md transition-all duration-300 hover:scale-[1.005] hover:shadow-md sm:p-7">
      {/* <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-sky-400/20 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      /> */}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/70 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600">
            #{rank} match
          </span>
          <Link
            href={`/universities/${result.id}`}
            className="block group/title"
          >
            <h3 className="text-gradient font-display text-2xl font-bold leading-snug">
              {result.name}
            </h3>
          </Link>
          <p className="text-sm text-zinc-500">{result.city}</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="relative flex size-16 items-center justify-center">
            <div className="relative flex size-16 flex-col items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-base font-bold leading-none tabular-nums">
                {scorePct}%
              </span>
              <span className="text-[9px] font-medium uppercase tracking-wide opacity-80">
                match
              </span>
            </div>
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onToggleFavorite}
            disabled={isPending}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            className="rounded-full bg-white/60 shadow-sm cursor-pointer"
          >
            <Heart
              className={cn(
                "size-5",
                isFavorite && "fill-rose-500 text-rose-500",
              )}
            />
          </Button>
        </div>
      </div>

      {/* Badges */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {result.majorNames.map((name) => (
          <Badge
            key={name}
            variant="secondary"
            className="rounded-full border-white/40 bg-white/70 text-zinc-600"
          >
            {name}
          </Badge>
        ))}
      </div>

      {/* Overall match bar */}
      <div className="mt-6 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-zinc-500">Overall fit</span>
          <span className={cn("tabular-nums", matchText(scorePct))}>
            {scorePct}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-zinc-200/70">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              matchColor(scorePct),
            )}
            style={{ width: `${Math.min(100, scorePct)}%` }}
          />
        </div>
      </div>

      {/* Breakdown */}
      <div className="mt-5 space-y-2.5">
        {SECTIONS.map((s) => {
          const pct = Math.round((result.breakdown[s.key] ?? 0) * 100);
          return (
            <div key={s.key} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-xs font-medium text-zinc-500">
                {s.label}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200/70">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    matchColor(pct),
                  )}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-xs tabular-nums text-zinc-400">
                {pct}
              </span>
            </div>
          );
        })}
      </div>

      <div className="w-full flex justify-end">
        <Link
          href={`/universities/${result.id}`}
          className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-sky-600 transition-colors hover:text-sky-700"
        >
          View details
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
