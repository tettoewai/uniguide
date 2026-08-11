"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
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
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

export function AdminMobileNav() {
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
    <Sheet>
      <SheetTrigger
        aria-label={dict.nav.openMenu}
        className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" showCloseButton={false} className="w-64 p-0">
        <SheetTitle className="sr-only">{dict.nav.navigation}</SheetTitle>
        <nav className="flex flex-col gap-1 p-4">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
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
        </nav>
      </SheetContent>
    </Sheet>
  );
}
