import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CatalogTabs } from "@/components/sections/CatalogTabs";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { catalog, fabricTags as fallbackFabricTags } from "@/data/catalog";
import { prisma } from "@/lib/prisma";
import type { CatalogFabricTag, CatalogFabricTagItem } from "@/types";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Conheça modelos de sofás e opções de tecidos para projetos sob medida da Projete Estofados.",
};

export const dynamic = "force-dynamic";

function parseFabricTags(
  tags: string,
  availableTags: CatalogFabricTagItem[],
): CatalogFabricTag[] {
  const validFabricTags = new Set(availableTags.map((tag) => tag.id));

  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag): tag is CatalogFabricTag =>
      validFabricTags.has(tag as CatalogFabricTag),
    );
}

export default async function CatalogPage() {
  const [models, fabrics, fabricTags] = await Promise.all([
    prisma.catalogModel.findMany({
      where: {
        active: true,
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        imageUrl: true,
        category: true,
        size: true,
        fabric: true,
        armSize: true,
        structure: true,
        whatsappMessage: true,
      },
    }),
    prisma.catalogFabric.findMany({
      where: {
        active: true,
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        imageUrl: true,
        description: true,
        tags: true,
      },
    }),
    prisma.catalogFabricTag.findMany({
      orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
      select: {
        id: true,
        label: true,
        icon: true,
      },
    }),
  ]);
  const catalogModels = models.length > 0 ? models : catalog.modelos;
  const availableFabricTags = fabricTags.length > 0 ? fabricTags : fallbackFabricTags;
  const catalogFabrics =
    fabrics.length > 0
      ? fabrics.map((fabric) => ({
          ...fabric,
          tags: parseFabricTags(fabric.tags, availableFabricTags),
        }))
      : catalog.tecidos;

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

            <CatalogTabs
              fabrics={catalogFabrics}
              fabricTags={availableFabricTags}
              models={catalogModels}
            />
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
