"use client";

import { useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";
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

const CITY_ITEMS: Record<string, string> = {
  Yangon: "Yangon",
  Mandalay: "Mandalay",
  Naypyidaw: "Naypyidaw",
};

const formSchema = z.object({
  budget: z.coerce.number().min(0).nullable(),
  preferredCity: z.string().nullable(),
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
  initialValues: OnboardingFormValues;
};

const STEP_DEFS = [
  {
    icon: Wallet,
    title: "Budget & location",
    subtitle: "How do you plan to fund your studies?",
  },
  {
    icon: ScrollText,
    title: "Your marks",
    subtitle: "Grade 12 subject marks out of 100.",
  },
  {
    icon: GraduationCap,
    title: "Preferred majors",
    subtitle: "Pick every field that interests you.",
  },
  {
    icon: Heart,
    title: "Hobbies & interests",
    subtitle: "We match these to the right course.",
  },
];

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
  "h-12 rounded-md bg-white/80 border-0 ring-1 ring-zinc-200/70 focus:ring-2 focus:ring-sky-300 outline-none placeholder:text-zinc-400";

const pillChipClass = (active: boolean) =>
  cn(
    "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
    active
      ? "border-transparent bg-primary text-primary-foreground shadow-lg shadow-sky-300/50"
      : "border-zinc-200/80 bg-white/70 text-zinc-600 hover:border-sky-200 hover:text-sky-600",
  );

export function OnboardingForm({
  subjects,
  majors,
  hobbies,
  initialValues,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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

  const selectedMajors = watch("preferredMajors");
  const selectedHobbies = watch("hobbies");
  const selectedCity = watch("preferredCity");

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

  const onSubmit = (values: OnboardingFormValues) => {
    startTransition(async () => {
      await updateUserPreferences(values);
      toast.success("Preferences saved");
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
<StepCard step={STEP_DEFS[0]}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="budget">Annual budget (MMK)</Label>
            <Input
              id="budget"
              type="number"
              min={0}
              placeholder="e.g. 2000000"
              className={pillInputClass}
              {...register("budget")}
            />
          </div>
          <div className="space-y-2">
            <Label>Preferred city</Label>
            <ControllerSelect
              items={CITY_ITEMS}
              current={selectedCity}
              placeholder="Choose a city"
              onPick={(v) => setValue("preferredCity", v, { shouldValidate: true })}
            />
          </div>
        </div>
      </StepCard>

      <StepCard step={STEP_DEFS[1]}>
        <div className="grid gap-4 sm:grid-cols-2">
          {subjects.map((subject) => (
            <div key={subject.id} className="space-y-2">
              <Label htmlFor={`mark-${subject.id}`}>{subject.name}</Label>
              <Input
                id={`mark-${subject.id}`}
                type="number"
                min={0}
                max={100}
                placeholder="0 - 100"
                className={pillInputClass}
                {...register(`marks.${subject.id}`)}
              />
            </div>
          ))}
        </div>
      </StepCard>

      <StepCard step={STEP_DEFS[2]}>
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

      <StepCard step={STEP_DEFS[3]}>
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
        className="inline-flex w-full items-center justify-center rounded-full bg-primary px-12 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-sky-300/60 transition-all duration-300 hover:bg-sky-600 hover:shadow-xl hover:shadow-sky-300/70 disabled:pointer-events-none disabled:opacity-60"
      >
        {isPending ? "Matching you up…" : "Get my recommendations"}
      </button>
    </form>
  );
}

function StepCard({
  step: { icon: Icon, title, subtitle },
  children,
}: {
  step: (typeof STEP_DEFS)[number];
  children: React.ReactNode;
}) {
  return (
    <section className="glass rounded-3xl p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-sky-300/50">
          <Icon className="size-5" />
        </span>
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-zinc-800">
            {title}
          </h2>
          <p className="text-sm text-zinc-500">{subtitle}</p>
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
