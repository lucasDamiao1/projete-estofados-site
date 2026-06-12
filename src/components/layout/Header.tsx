import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/BrandIcon";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { brand } from "@/constants/brand";
import { links } from "@/constants/links";
import { site } from "@/constants/site";

const mobileNavRows = [
  site.navItems.slice(0, 3),
  site.navItems.slice(3),
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/90 backdrop-blur-xl">
      <Container className="py-4">
        <div className="flex items-center justify-between gap-5">
          <Link
            href="/#inicio"
            className="relative block h-9 w-[172px] shrink-0 sm:h-11 sm:w-[210px]"
            aria-label={`${brand.name} - ir para o início`}
          >
            <Image
              src="/images/logo-navbar.png"
              alt=""
              fill
              priority
              sizes="(min-width: 640px) 210px, 172px"
              className="object-contain"
            />
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

          <div className="hidden items-center gap-3 sm:flex">
            <Button asChild size="sm" variant="secondary">
              <Link
                href="/catalogo"
                aria-label="Ver catálogo da Projete Estofados"
              >
                <BookOpen className="size-4" aria-hidden="true" />
                Ver catálogo
              </Link>
            </Button>

            <Button asChild size="sm">
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
          </div>

          <div className="flex items-center gap-2 sm:hidden">
            <Button asChild size="icon" variant="secondary">
              <Link
                href="/catalogo"
                aria-label="Ver catálogo da Projete Estofados"
              >
                <BookOpen className="size-4" aria-hidden="true" />
              </Link>
            </Button>

            <Button asChild size="icon" variant="primary">
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
        </div>

        <nav
          className="mt-4 space-y-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-muted lg:hidden"
          aria-label="Navegação principal mobile"
        >
          {mobileNavRows.map((row, index) => (
            <div
              key={index}
              className={
                index === 0
                  ? "grid grid-cols-3 gap-3 text-center"
                  : "flex justify-center gap-10 text-center"
              }
            >
              {row.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </Container>
    </header>
  );
}
