import { redirect } from "next/navigation";
import { LayoutDashboard, LogOut } from "lucide-react";
import { auth } from "@/auth";
import { logoutAction } from "../actions";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { brand } from "@/constants/brand";

export const metadata = {
  title: "Dashboard administrativo",
};

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-primary/10 bg-white">
        <Container className="flex min-h-20 flex-col justify-center gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Admin
            </p>
            <h1 className="font-serif text-3xl text-primary">{brand.name}</h1>
          </div>

          <form action={logoutAction}>
            <Button type="submit" variant="secondary">
              <LogOut aria-hidden="true" className="size-4" />
              Sair
            </Button>
          </form>
        </Container>
      </header>

      <Container className="py-10">
        <section className="mb-10 flex flex-col gap-4 border-b border-primary/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex size-11 items-center justify-center rounded-md bg-primary text-background">
              <LayoutDashboard aria-hidden="true" className="size-5" />
            </div>
            <h2 className="font-serif text-4xl text-foreground">
              Dashboard administrativo
            </h2>
            <p className="text-sm leading-6 text-muted">
              Base autenticada pronta para receber catalogo, midia e conteudo em
              etapas futuras.
            </p>
          </div>

          <div className="text-sm text-muted">
            Sessao ativa para{" "}
            <span className="font-medium text-foreground">
              {session.user.email}
            </span>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {["Catalogo", "Midia", "Conteudo"].map((moduleName) => (
            <div
              className="rounded-lg border border-primary/10 bg-surface/25 p-5 shadow-soft"
              key={moduleName}
            >
              <p className="text-sm font-semibold text-primary">{moduleName}</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Modulo reservado para expansao futura.
              </p>
            </div>
          ))}
        </section>
      </Container>
    </main>
  );
}
