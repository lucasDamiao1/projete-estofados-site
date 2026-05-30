import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

type AboutStat = {
  label: string;
  title: string;
};

type AboutSectionProps = {
  description?: string;
  eyebrow?: string;
  imageSrc?: string;
  stats?: AboutStat[];
  title?: string;
};

const aboutDefaults = {
  description:
    "A Projete Estofados cria sofás personalizados para quem busca conforto, beleza e exclusividade. Cada detalhe é pensado para valorizar o ambiente e refletir o estilo de quem vive nele.",
  eyebrow: "Sobre a Projete",
  imageSrc:
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1100&q=82",
  stats: [
    { title: "Sob medida", label: "proporção" },
    { title: "Premium", label: "acabamento" },
    { title: "Curitiba", label: "atendimento" },
  ],
  title: "Mais do que um sofá, uma peça feita para o seu espaço",
};

export function AboutSection({
  description = aboutDefaults.description,
  eyebrow = aboutDefaults.eyebrow,
  imageSrc = aboutDefaults.imageSrc,
  stats = aboutDefaults.stats,
  title = aboutDefaults.title,
}: AboutSectionProps) {
  return (
    <Section id="sobre" className="bg-background" aria-labelledby="about-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <Reveal className="relative min-h-[430px] overflow-hidden rounded-lg shadow-soft">
            <Image
              src={imageSrc}
              alt="Ambiente acolhedor com sofá elegante e decoração refinada"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </Reveal>

          <Reveal delay={0.12}>
            <p className="text-xs font-medium uppercase tracking-[0.26em] text-accent">
              {eyebrow}
            </p>
            <h2
              id="about-title"
              className="mt-4 max-w-2xl font-serif text-4xl font-semibold leading-tight text-primary sm:text-5xl"
            >
              {title}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
              {description}
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.title} className="border-l border-accent pl-5">
                  <p className="font-serif text-3xl text-primary">
                    {stat.title}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
