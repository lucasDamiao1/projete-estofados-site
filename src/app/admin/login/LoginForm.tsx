"use client";

import { LogIn } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { loginAction, type LoginState } from "../actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="email">
          E-mail
        </label>
        <input
          autoComplete="email"
          className="min-h-12 w-full rounded-md border border-primary/15 bg-white px-4 text-sm text-foreground shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
          id="email"
          name="email"
          placeholder="admin@exemplo.com"
          required
          type="email"
        />
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium text-foreground"
          htmlFor="password"
        >
          Senha
        </label>
        <input
          autoComplete="current-password"
          className="min-h-12 w-full rounded-md border border-primary/15 bg-white px-4 text-sm text-foreground shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
          id="password"
          name="password"
          placeholder="Digite sua senha"
          required
          type="password"
        />
      </div>

      {state.error ? (
        <p className="rounded-md border border-accent/25 bg-accent/10 px-4 py-3 text-sm text-foreground">
          {state.error}
        </p>
      ) : null}

      <Button className="w-full" disabled={isPending} type="submit">
        <LogIn aria-hidden="true" className="size-4" />
        {isPending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
