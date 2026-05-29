import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { auth } from "@/auth";
import { brand } from "@/constants/brand";

export const metadata = {
  title: "Login administrativo",
};

export default async function AdminLoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-5 py-12">
      <section className="w-full max-w-md rounded-lg border border-primary/10 bg-surface/25 p-6 shadow-soft sm:p-8">
        <div className="mb-8 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Painel administrativo
          </p>
          <div className="space-y-2">
            <h1 className="font-serif text-3xl text-primary">{brand.name}</h1>
            <p className="text-sm leading-6 text-muted">
              Acesse a area administrativa para gerenciar os proximos modulos do
              site.
            </p>
          </div>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}
