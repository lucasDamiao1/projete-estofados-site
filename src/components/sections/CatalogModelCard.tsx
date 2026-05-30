import Image from "next/image";
import { WhatsAppIcon } from "@/components/ui/BrandIcon";
import { Button } from "@/components/ui/Button";
import { brand } from "@/constants/brand";
import type { CatalogModelItem } from "@/types";

type CatalogModelCardProps = {
  model: CatalogModelItem;
};

const modelDetails = [
  ["size", "Tamanho"],
  ["fabric", "Tecido"],
  ["armSize", "Braço"],
  ["structure", "Estrutura"],
] as const;

export function CatalogModelCard({ model }: CatalogModelCardProps) {
  const whatsappHref = `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
    model.whatsappMessage,
  )}`;

  return (
    <article className="overflow-hidden rounded-lg bg-background shadow-soft md:grid md:grid-cols-[3fr_2fr]">
      <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[240px]">
        <Image
          src={model.imageUrl}
          alt={model.name}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 60vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col justify-center p-4 sm:p-5">
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.2em] text-accent">
          {model.category}
        </p>
        <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight text-primary">
          {model.name}
        </h2>

        <dl className="mt-4 grid gap-2 sm:grid-cols-2">
          {modelDetails.map(([key, label]) => (
            <div key={key} className="border-t border-primary/10 pt-2">
              <dt className="text-[0.64rem] font-medium uppercase tracking-[0.14em] text-muted">
                {label}
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-primary">
                {model[key]}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-5">
          <Button asChild variant="primary" size="sm">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              aria-label={`Solicitar orçamento para ${model.name}`}
            >
              <WhatsAppIcon className="size-4" />
              Solicitar orçamento
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
