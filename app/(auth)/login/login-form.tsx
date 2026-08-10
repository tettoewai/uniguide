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

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction, isPending] = useActionState<
    AuthFormState,
    FormData
  >(loginUser, {
    error: undefined,
  });

  return (
    <Card className="glass rounded-3xl p-4 shadow-2xl shadow-sky-300/20">
      <CardHeader className="text-center">
        <CardTitle className="font-display text-3xl font-bold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription>
          Sign in to UniGuide to see your university matches.
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="h-12 rounded-md border-0 bg-white/80 ring-1 ring-zinc-200/70 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              name="password"
              required
              placeholder="Enter your password"
              className="h-12 rounded-md border-0 bg-white/80 ring-1 ring-zinc-200/70 outline-none focus:ring-2 focus:ring-sky-300"
            />
          </div>
          {state?.error ? (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          ) : null}
          <Button
            type="submit"
            className="h-12 w-full rounded-full bg-primary shadow-lg shadow-sky-300/60 hover:bg-sky-600"
            disabled={isPending}
          >
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-500">
          No account yet?{" "}
          <Link
            href="/register"
            className="font-medium text-sky-600 underline underline-offset-4"
          >
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
