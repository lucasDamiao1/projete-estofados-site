import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { gallery } from "@/data/gallery";
import { cn } from "@/lib/utils";

export function GallerySection() {
  return (
    <Section
      id="inspiracoes"
      className="bg-surface"
      aria-labelledby="gallery-title"
    >
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.26em] text-accent">
              Inspirações
            </p>
            <h2
              id="gallery-title"
              className="mt-4 max-w-2xl font-serif text-4xl font-semibold leading-tight text-primary sm:text-5xl"
            >
              Ambientes criados para unir conforto, elegância e personalidade
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="lg:justify-self-end">
            <p className="max-w-xl text-base leading-8 text-muted">
              Inspire-se em ambientes criados para unir conforto, elegância e
              personalidade.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid auto-rows-[260px] gap-4 md:grid-cols-4 md:auto-rows-[220px] lg:auto-rows-[260px]">
          {gallery.map((item, index) => (
            <Reveal
              key={item.title}
              delay={index * 0.05}
              className={cn(
                "group relative overflow-hidden rounded-lg bg-surface shadow-soft",
                item.orientation === "landscape"
                  ? "md:col-span-2"
                  : "md:row-span-2",
              )}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-dark/20 to-transparent opacity-90" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="font-serif text-2xl font-semibold text-background">
                  {item.title}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal
          delay={0.16}
          className="mt-10 flex flex-col items-center justify-center gap-5 text-center"
        >
          <p className="max-w-lg text-sm leading-7 text-muted">
            Quer ver mais modelos, acabamentos e inspirações? Acesse nosso
            catálogo.
          </p>
          <Button asChild variant="secondary">
            <Link
              href="/catalogo"
              aria-label="Ver catálogo de modelos e tecidos da Projete Estofados"
            >
              <BookOpen className="size-4" aria-hidden="true" />
              Catálogo
            </Link>
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
