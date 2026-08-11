"use client";

import { useTransition, useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  GraduationCap,
  Heart,
  Wallet,
  ScrollText,
  Code,
  Bot,
  Stethoscope,
  PenLine,
  Mic,
  Leaf,
  Sparkles,
  MapPin,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { updateUserPreferences } from "@/app/actions/user";
import { useLocale } from "@/components/providers/locale-provider";

const formSchema = z.object({
  budget: z.coerce.number().min(0).nullable(),
  preferredCityId: z.string().nullable(),
  latitude: z.coerce.number().min(-90).max(90).nullable(),
  longitude: z.coerce.number().min(-180).max(180).nullable(),
  preferredMajors: z.array(z.string()),
  marks: z.record(z.string(), z.coerce.number().min(0).max(100)),
  hobbies: z.array(z.string()),
});

export type OnboardingFormValues = z.infer<typeof formSchema>;

type Props = {
  subjects: { id: string; name: string }[];
  majors: { id: string; name: string }[];
  hobbies: {
    id: string;
    name: string;
    icon?: string | null;
    color?: string | null;
  }[];
  cities: { id: string; name: string }[];
  initialValues: OnboardingFormValues;
};

const STEP_DEFS = (dict: {
  stepBudgetTitle: string;
  stepBudgetSubtitle: string;
  stepMarksTitle: string;
  stepMarksSubtitle: string;
  stepMajorsTitle: string;
  stepMajorsSubtitle: string;
  stepHobbiesTitle: string;
  stepHobbiesSubtitle: string;
}): StepDef[] => [
  {
    icon: Wallet,
    title: dict.stepBudgetTitle,
    subtitle: dict.stepBudgetSubtitle,
  },
  {
    icon: ScrollText,
    title: dict.stepMarksTitle,
    subtitle: dict.stepMarksSubtitle,
  },
  {
    icon: GraduationCap,
    title: dict.stepMajorsTitle,
    subtitle: dict.stepMajorsSubtitle,
  },
  {
    icon: Heart,
    title: dict.stepHobbiesTitle,
    subtitle: dict.stepHobbiesSubtitle,
  },
];

type StepDef = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
};

const HOBBY_ICONS: Record<string, LucideIcon> = {
  "hobby-coding": Code,
  "hobby-robotics": Bot,
  "hobby-medical": Stethoscope,
  "hobby-writing": PenLine,
  "hobby-speaking": Mic,
  "hobby-enviro": Leaf,
};

function HobbyIcon({ id, className }: { id: string; className?: string }) {
  const Icon = HOBBY_ICONS[id] ?? Sparkles;
  return <Icon className={className} aria-hidden />;
}

const pillInputClass =
  "h-12 rounded-md bg-background/80 border-0 ring-1 ring-border focus:ring-2 focus:ring-sky-300 outline-none placeholder:text-muted-foreground";

const pillChipClass = (active: boolean) =>
  cn(
    "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
    active
      ? "border-transparent bg-primary text-primary-foreground"
      : "border-border bg-background/70 text-muted-foreground hover:border-sky-200 hover:text-sky-600",
  );

export function OnboardingForm({
  subjects,
  majors,
  hobbies,
  cities,
  initialValues,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [locating, setLocating] = useState(false);
  const { dict } = useLocale();
  const steps = STEP_DEFS(dict.onboarding);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<
    OnboardingFormValues,
    Record<string, unknown>,
    OnboardingFormValues
  >({
    resolver: zodResolver(formSchema) as Resolver<
      OnboardingFormValues,
      Record<string, unknown>,
      OnboardingFormValues
    >,
    defaultValues: initialValues,
  });

  const selectedMajors = useWatch({ control, name: "preferredMajors" });
  const selectedHobbies = useWatch({ control, name: "hobbies" });
  const selectedCityId = useWatch({ control, name: "preferredCityId" });
  const lat = useWatch({ control, name: "latitude" });
  const lon = useWatch({ control, name: "longitude" });

  const toggleValue = (
    field: "preferredMajors" | "hobbies",
    value: string,
    values: string[],
  ) => {
    setValue(
      field,
      values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value],
      { shouldValidate: true },
    );
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error(dict.onboarding.geolocationUnsupported);
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue("latitude", position.coords.latitude, { shouldValidate: true });
        setValue("longitude", position.coords.longitude, { shouldValidate: true });
        setLocating(false);
        toast.success(dict.onboarding.locationCaptured);
      },
      (error) => {
        setLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error(dict.onboarding.permissionDenied);
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error(dict.onboarding.positionUnavailable);
            break;
          case error.TIMEOUT:
            toast.error(dict.onboarding.timeout);
            break;
          default:
            toast.error(dict.onboarding.locationError);
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  const onSubmit = (values: OnboardingFormValues) => {
    startTransition(async () => {
      await updateUserPreferences(values);
      toast.success(dict.onboarding.preferencesSaved);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <StepCard step={steps[0]}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="budget">{dict.onboarding.budgetLabel}</Label>
            <Input
              id="budget"
              type="number"
              min={0}
              placeholder={dict.onboarding.budgetPlaceholder}
              className={pillInputClass}
              {...register("budget")}
            />
          </div>
          <div className="space-y-2">
            <Label>{dict.onboarding.preferredCity}</Label>
            <ControllerSelect
              items={Object.fromEntries(cities.map((c) => [c.id, c.name]))}
              current={selectedCityId}
              placeholder={dict.onboarding.chooseCity}
              onPick={(v) => setValue("preferredCityId", v, { shouldValidate: true })}
            />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Label>{dict.onboarding.yourLocation}</Label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locating}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background/70 px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-sky-200 hover:text-sky-600 disabled:pointer-events-none disabled:opacity-60"
            >
              {locating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <MapPin className="size-4" />
              )}
              {locating ? dict.onboarding.gettingLocation : dict.onboarding.useMyLocation}
            </button>
            {lat !== null && lon !== null && (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground">
                <MapPin className="size-3" />
                {lat.toFixed(4)}, {lon.toFixed(4)}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {dict.onboarding.locationHint}
          </p>
          <input type="hidden" {...register("latitude")} />
          <input type="hidden" {...register("longitude")} />
        </div>
      </StepCard>

      <StepCard step={steps[1]}>
        <div className="grid gap-4 sm:grid-cols-2">
          {subjects.map((subject) => (
            <div key={subject.id} className="space-y-2">
              <Label htmlFor={`mark-${subject.id}`}>{subject.name}</Label>
              <Input
                id={`mark-${subject.id}`}
                type="number"
                min={0}
                max={100}
                placeholder={dict.onboarding.marksPlaceholder}
                className={pillInputClass}
                {...register(`marks.${subject.id}`)}
              />
            </div>
          ))}
        </div>
      </StepCard>

      <StepCard step={steps[2]}>
        <div className="flex flex-wrap gap-2">
          {majors.map((major) => {
            const active = selectedMajors.includes(major.id);
            return (
              <button
                key={major.id}
                type="button"
                onClick={() =>
                  toggleValue("preferredMajors", major.id, selectedMajors)
                }
                className={pillChipClass(active)}
              >
                {major.name}
              </button>
            );
          })}
        </div>
      </StepCard>

      <StepCard step={steps[3]}>
        <div className="flex flex-wrap gap-2">
          {hobbies.map((hobby) => {
            const active = selectedHobbies.includes(hobby.id);
            return (
              <button
                key={hobby.id}
                type="button"
                onClick={() =>
                  toggleValue("hobbies", hobby.id, selectedHobbies)
                }
                className={cn(
                  pillChipClass(active),
                  "inline-flex items-center gap-1.5",
                )}
              >
                <HobbyIcon id={hobby.id} className="size-4" />
                {hobby.name}
              </button>
            );
          })}
        </div>
      </StepCard>

      {errors.root ? (
        <p className="text-sm text-destructive">
          {String(errors.root?.message)}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-full bg-primary px-12 py-4 text-base font-semibold text-primary-foreground transition-all duration-300 hover:bg-sky-600 disabled:pointer-events-none disabled:opacity-60"
      >
        {isPending ? dict.onboarding.submitting : dict.onboarding.submit}
      </button>
    </form>
  );
}

function StepCard({
  step: { icon: Icon, title, subtitle },
  children,
}: {
  step: StepDef;
  children: React.ReactNode;
}) {
  return (
    <section className="glass rounded-3xl p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Icon className="size-5" />
        </span>
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function ControllerSelect({
  items,
  placeholder,
  current,
  onPick,
}: {
  items: Record<string, string>;
  placeholder: string;
  current: string | null;
  onPick: (value: string) => void;
}) {
  return (
    <Select
      items={items}
      value={current}
      onValueChange={(v) => onPick(v as string)}
    >
      <SelectTrigger
        className={cn("w-full rounded-md", pillInputClass, "!h-12")}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(items).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
