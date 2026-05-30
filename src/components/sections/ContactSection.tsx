import { Clock, MapPin } from "lucide-react";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcon";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { brand } from "@/constants/brand";
import { links } from "@/constants/links";

type ContactSectionProps = {
  addressTitle?: string;
  description?: string;
  eyebrow?: string;
  hoursTitle?: string;
  primaryCta?: string;
  secondaryCta?: string;
  socialTitle?: string;
  title?: string;
};

const contactDefaults = {
  addressTitle: "Endereço",
  description:
    "Converse com a Projete Estofados e comece a desenhar uma peça que respeita seu ambiente, sua rotina e seu estilo.",
  eyebrow: "Contato",
  hoursTitle: "Horário",
  primaryCta: "Falar com a Projete Estofados",
  secondaryCta: "Acompanhar no Instagram",
  socialTitle: "Redes sociais",
  title: "Pronto para criar o sofá ideal para sua casa?",
};

export function ContactSection({
  addressTitle = contactDefaults.addressTitle,
  description = contactDefaults.description,
  eyebrow = contactDefaults.eyebrow,
  hoursTitle = contactDefaults.hoursTitle,
  primaryCta = contactDefaults.primaryCta,
  secondaryCta = contactDefaults.secondaryCta,
  socialTitle = contactDefaults.socialTitle,
  title = contactDefaults.title,
}: ContactSectionProps) {
  return (
    <Section id="contato" className="bg-surface" aria-labelledby="contact-title">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.26em] text-accent">
            {eyebrow}
          </p>
          <h2
            id="contact-title"
            className="mt-4 font-serif text-4xl font-semibold leading-tight text-primary sm:text-5xl"
          >
            {title}
          </h2>
          <p className="mt-5 text-base leading-8 text-muted">
            {description}
          </p>
        </Reveal>

        <Reveal
          delay={0.1}
          className="mx-auto mt-10 flex max-w-2xl flex-col justify-center gap-3 sm:flex-row"
        >
          <Button asChild variant="primary">
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noreferrer"
              aria-label="Falar com a Projete Estofados pelo WhatsApp"
            >
              <WhatsAppIcon className="size-4" />
              {primaryCta}
            </a>
          </Button>
          <Button asChild variant="secondary">
            <a
              href={links.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Acompanhar a Projete Estofados no Instagram"
            >
              <InstagramIcon className="size-4" />
              {secondaryCta}
            </a>
          </Button>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-3">
          <Reveal className="rounded-lg border border-primary/10 bg-background/80 p-6 shadow-soft">
            <MapPin className="size-5 text-accent" aria-hidden="true" />
            <h3 className="mt-5 font-serif text-2xl text-primary">
              {addressTitle}
            </h3>
            <a
              href={links.maps}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block text-sm leading-7 text-muted transition hover:text-primary"
            >
              {brand.address}
            </a>
          </Reveal>

          <Reveal
            delay={0.05}
            className="rounded-lg border border-primary/10 bg-background/80 p-6 shadow-soft"
          >
            <Clock className="size-5 text-accent" aria-hidden="true" />
            <h3 className="mt-5 font-serif text-2xl text-primary">
              {hoursTitle}
            </h3>
            <p className="mt-3 text-sm leading-7 text-muted">
              {brand.weekdayHours}
              <br />
              {brand.saturdayHours}
            </p>
          </Reveal>

          <Reveal
            delay={0.1}
            className="rounded-lg border border-primary/10 bg-background/80 p-6 shadow-soft"
          >
            <InstagramIcon className="size-5 text-accent" />
            <h3 className="mt-5 font-serif text-2xl text-primary">
              {socialTitle}
            </h3>
            <div className="mt-3 space-y-2 text-sm leading-7 text-muted">
              <a
                href={links.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 transition hover:text-primary"
              >
                <InstagramIcon className="size-4 text-accent" />
                @projeteestofados_
              </a>
              <a
                href={links.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 transition hover:text-primary"
              >
                <WhatsAppIcon className="size-4 text-accent" />
                WhatsApp {brand.phoneDisplay}
              </a>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
