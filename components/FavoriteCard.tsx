"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toggleFavorite } from "@/app/actions/university";

export function FavoriteCard({
  universityId,
  name,
  city,
  majors,
}: {
  universityId: string;
  name: string;
  city: string;
  majors: string[];
}) {
  const [removed, setRemoved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onRemove = () => {
    startTransition(async () => {
      await toggleFavorite(universityId);
      setRemoved(true);
      toast.success("Removed from favorites");
    });
  };

  if (removed) return null;

  return (
    <Link href={`/universities/${universityId}`} className="group/title">
      <Card className="glass rounded-3xl transition-all duration-300 hover:scale-[1.02] cursor-pointer">
        <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
          <CardTitle className="text-base">
            <span className="font-display text-xl font-bold transition-colors">
              {name}
            </span>
          </CardTitle>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onRemove}
            disabled={isPending}
            aria-label="Remove from favorites"
            className="rounded-full bg-card/60"
          >
            <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-sky-500" />
            {city}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {majors.map((m) => (
              <Badge
                key={m}
                variant="secondary"
                className="rounded-full border-border bg-secondary text-secondary-foreground"
              >
                {m}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
