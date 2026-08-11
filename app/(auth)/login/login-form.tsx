"use client";

import { useActionState } from "react";
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
import { loginUser, type AuthFormState } from "@/app/actions/auth";
import { PasswordInput } from "@/components/ui/password-input";
import { useLocale } from "@/components/providers/locale-provider";

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const { dict } = useLocale();
  const [state, formAction, isPending] = useActionState<
    AuthFormState,
    FormData
  >(loginUser, {
    error: undefined,
  });

  return (
    <Card className="glass rounded-3xl p-4">
      <CardHeader className="text-center">
        <CardTitle className="font-display text-3xl font-bold tracking-tight">
          {dict.auth.login.title}
        </CardTitle>
        <CardDescription>
          {dict.auth.login.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input
            type="hidden"
            name="callbackUrl"
            value={callbackUrl ?? "/dashboard"}
          />
          <div className="space-y-2">
            <Label htmlFor="email">{dict.auth.login.email}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={dict.auth.login.emailPlaceholder}
              required
              className="h-12 rounded-md border-0 bg-background/80 ring-1 ring-border outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-sky-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{dict.auth.login.password}</Label>
            <PasswordInput
              id="password"
              name="password"
              required
              placeholder={dict.auth.login.passwordPlaceholder}
              className="h-12 rounded-md border-0 bg-background/80 ring-1 ring-border outline-none focus:ring-2 focus:ring-sky-300"
            />
          </div>
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
            {isPending ? dict.auth.login.submitting : dict.auth.login.submit}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {dict.auth.login.noAccount}{" "}
          <Link
            href="/register"
            className="font-medium text-sky-600 underline underline-offset-4"
          >
            {dict.auth.login.createOne}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
