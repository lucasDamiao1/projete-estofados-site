import { MapPin } from "lucide-react";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcon";
import { Container } from "@/components/ui/Container";
import { brand } from "@/constants/brand";
import { links } from "@/constants/links";

export function Footer() {
  return (
    <footer className="bg-primary py-12 text-background">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr] md:items-start">
          <div>
            <p className="font-serif text-3xl font-semibold leading-none text-background">
              Projete
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.24em] text-accent">
              Estofados
            </p>
            <p className="mt-4 max-w-sm text-sm leading-7 text-background/70">
              {brand.tagline}
            </p>
          </div>

          <div className="space-y-3 text-sm text-background/70">
            <a
              href={links.maps}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 transition hover:text-background"
            >
              <MapPin className="mt-0.5 size-4 text-accent" aria-hidden="true" />
              {brand.address}
            </a>
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 transition hover:text-background"
            >
              <WhatsAppIcon className="size-4 text-accent" />
              WhatsApp {brand.phoneDisplay}
            </a>
          </div>

          <div className="space-y-3 text-sm text-background/70">
            <a
              href={links.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 transition hover:text-background"
            >
              <InstagramIcon className="size-4 text-accent" />
              @projeteestofados_
            </a>
            <p>{brand.weekdayHours}</p>
            <p>{brand.saturdayHours}</p>
          </div>
        </div>

        <div className="mt-10 border-t border-background/10 pt-6 text-xs uppercase tracking-[0.18em] text-background/50">
          © {new Date().getFullYear()} {brand.name}. Todos os direitos
          reservados.
        </div>
      </Container>
    </footer>
  );
}
