"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { registerUser, type AuthFormState } from "@/app/actions/auth";
import { PasswordInput } from "@/components/ui/password-input";
import { useLocale } from "@/components/providers/locale-provider";

export function RegisterForm() {
  const { dict } = useLocale();
  const [state, formAction, isPending] = useActionState<
    AuthFormState,
    FormData
  >(registerUser, {
    error: undefined,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handleSubmit = (formData: FormData) => {
    const password = formData.get("password") as string;
    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }
    setPasswordMismatch(false);
    formAction(formData);
  };

  return (
    <Card className="glass rounded-3xl p-4">
      <CardHeader className="text-center">
        <CardTitle className="font-display text-3xl font-bold tracking-tight">
          {dict.auth.register.title}
        </CardTitle>
        <CardDescription>
          {dict.auth.register.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{dict.auth.register.fullName}</Label>
            <Input
              id="name"
              name="name"
              placeholder={dict.auth.register.fullNamePlaceholder}
              required
              className="h-12 rounded-md border-0 bg-background/80 ring-1 ring-border outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-sky-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{dict.auth.register.email}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={dict.auth.register.emailPlaceholder}
              required
              className="h-12 rounded-md border-0 bg-background/80 ring-1 ring-border outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-sky-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{dict.auth.register.password}</Label>
            <PasswordInput
              id="password"
              name="password"
              minLength={6}
              placeholder={dict.auth.register.passwordHint}
              required
              className="h-12 rounded-md border-0 bg-background/80 ring-1 ring-border outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-sky-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{dict.auth.register.confirmPassword}</Label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              minLength={6}
              placeholder={dict.auth.register.confirmPlaceholder}
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordMismatch(false);
              }}
              className="h-12 rounded-md border-0 bg-background/80 ring-1 ring-border outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-sky-300"
            />
          </div>
          {passwordMismatch ? (
            <p className="text-sm text-destructive" role="alert">
              {dict.auth.register.mismatch}
            </p>
          ) : null}
          {state?.error ? (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          ) : null}
          <Button
            type="submit"
            className="h-12 w-full rounded-full bg-primary hover:bg-sky-600"
            disabled={isPending}
          >
            {isPending ? dict.auth.register.submitting : dict.auth.register.submit}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {dict.auth.register.haveAccount}{" "}
          <Link
            href="/login"
            className="font-medium text-sky-600 underline underline-offset-4"
          >
            {dict.auth.register.signIn}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
