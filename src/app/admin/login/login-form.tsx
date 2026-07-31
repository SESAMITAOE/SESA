"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { loginAction, type LoginState } from "@/app/admin/login/actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="mt-8 grid gap-5">
      <label className="grid gap-2 text-sm font-semibold text-navy-950">
        Administrator email
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          className="h-12 rounded-xl border border-navy-950/10 bg-ivory px-4 font-normal outline-none transition focus:border-gold"
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-navy-950">
        Password
        <input
          required
          type="password"
          name="password"
          autoComplete="current-password"
          className="h-12 rounded-xl border border-navy-950/10 bg-ivory px-4 font-normal outline-none transition focus:border-gold"
        />
      </label>
      {state.message ? (
        <p
          className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900"
          role="alert"
        >
          {state.message}
        </p>
      ) : null}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
