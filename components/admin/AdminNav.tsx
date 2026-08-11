"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  BookOpen,
  GraduationCap,
  Sparkles,
  MessageSquareText,
  MapPin,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/providers/locale-provider";

export function AdminNav() {
  const pathname = usePathname();
  const { dict } = useLocale();

  const items = [
    { href: "/admin/universities", label: dict.admin.kindsPlural.university, icon: Building2 },
    { href: "/admin/cities", label: dict.admin.kindsPlural.city, icon: MapPin },
    { href: "/admin/subjects", label: dict.admin.kindsPlural.subject, icon: BookOpen },
    { href: "/admin/majors", label: dict.admin.kindsPlural.major, icon: GraduationCap },
    { href: "/admin/hobbies", label: dict.admin.kindsPlural.hobby, icon: Sparkles },
    { href: "/admin/reviews", label: dict.admin.kindsPlural.review, icon: MessageSquareText },
    { href: "/admin/settings", label: dict.nav.settings, icon: Settings },
  ];

  return (
    <nav
      aria-label={dict.admin.navAria}
      className="flex flex-wrap items-center justify-center"
    >
      <div className="gap-1.5 rounded-full border border-border bg-card/60 p-1.5 backdrop-blur-md w-fit hidden md:flex">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
