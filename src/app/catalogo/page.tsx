import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CatalogTabs } from "@/components/sections/CatalogTabs";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Conheça modelos de sofás e opções de tecidos para projetos sob medida da Projete Estofados.",
};

export default function CatalogPage() {
  return (
    <>
      <Header />
      <main className="bg-background">
        <Section className="pt-4 sm:pt-4 lg:pt-4" aria-labelledby="catalog-title">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.26em] text-accent">
                Catálogo
              </p>
              <h1
                id="catalog-title"
                className="mt-4 font-serif text-4xl font-semibold leading-tight text-primary sm:text-5xl"
              >
                Modelos e tecidos para criar o sofá ideal
              </h1>
            </div>

            <CatalogTabs />
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
