import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

type HeroSectionProps = {
  eyebrow?: string;
  footerText?: string;
  imageSrc?: string;
  title?: string;
};

const heroDefaults = {
  eyebrow: "Estofados personalizados em Curitiba",
  footerText: "Design, conforto e acabamento",
  imageSrc:
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=86",
  title: "Sofás sob medida para ambientes que merecem presença",
};

export function HeroSection({
  eyebrow = heroDefaults.eyebrow,
  footerText = heroDefaults.footerText,
  imageSrc = heroDefaults.imageSrc,
  title = heroDefaults.title,
}: HeroSectionProps) {
  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-[82svh] items-center overflow-hidden bg-primary py-20 text-background"
      aria-labelledby="hero-title"
    >
      <Image
        src={imageSrc}
        alt="Sala elegante com sofá claro em ambiente sofisticado"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-dark/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(181,107,77,0.18),transparent_32%)]" />

      <Container className="relative z-10">
        <Reveal className="flex min-h-[58svh] max-w-3xl flex-col justify-center py-10">
          <p className="mb-6 inline-flex w-fit rounded-full border border-background/20 bg-primary/80 px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.24em] text-background shadow-soft backdrop-blur-md">
            {eyebrow}
          </p>
          <h1
            id="hero-title"
            className="text-balance font-serif text-4xl font-semibold leading-[0.95] tracking-normal text-background drop-shadow-sm sm:text-6xl lg:text-7xl"
          >
            {title}
          </h1>
        </Reveal>

        <div className="absolute bottom-8 right-10 hidden items-center gap-3 rounded-full border border-background/20 bg-dark/50 px-5 py-3 text-xs uppercase tracking-[0.2em] text-background shadow-soft backdrop-blur-md lg:flex">
          <span className="h-px w-12 bg-accent" />
          {footerText}
          <span className="h-px w-12 bg-accent" />
        </div>
      </Container>
    </section>
  );
}
