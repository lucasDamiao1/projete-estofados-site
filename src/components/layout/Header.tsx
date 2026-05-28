import Image from "next/image";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/ui/BrandIcon";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { brand } from "@/constants/brand";
import { links } from "@/constants/links";
import { site } from "@/constants/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/90 backdrop-blur-xl">
      <Container className="py-4">
        <div className="flex items-center justify-between gap-5">
          <Link
            href="/#inicio"
            className="flex shrink-0 items-center gap-1"
            aria-label={`${brand.name} - ir para o início`}
          >
            <span className="relative block size-10 overflow-hidden rounded-full bg-primary/8 sm:size-11">
              <Image
                src="/images/icon-cropped.png"
                alt=""
                fill
                priority
                sizes="44px"
                className="object-contain"
              />
            </span>
            <span className="flex items-baseline gap-2">
              <span className="font-serif text-2xl font-semibold leading-none tracking-normal text-primary">
                Projete
              </span>
              <span className="font-sans text-[0.62rem] font-medium uppercase tracking-[0.22em] text-accent">
                Estofados
              </span>
            </span>
          </Link>

          <nav
            className="hidden items-center gap-8 text-xs font-medium uppercase tracking-[0.18em] text-muted lg:flex"
            aria-label="Navegação principal"
          >
            {site.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noreferrer"
              aria-label="Falar com a Projete Estofados no WhatsApp"
            >
              <WhatsAppIcon className="size-4" />
              Falar no WhatsApp
            </a>
          </Button>

          <Button asChild size="icon" variant="primary" className="sm:hidden">
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noreferrer"
              aria-label="Falar com a Projete Estofados no WhatsApp"
            >
              <WhatsAppIcon className="size-4" />
            </a>
          </Button>
        </div>

        <nav
          className="mt-4 flex gap-5 overflow-x-auto pb-1 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-muted lg:hidden"
          aria-label="Navegação principal mobile"
        >
          {site.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 transition hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
