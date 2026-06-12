import Image from "next/image";
import { cn } from "@/lib/utils";

export type CatalogModelVisualCardModel = {
  armSize: string;
  category: string;
  fabric: string;
  imagePosition?: string;
  imageUrl: string;
  name: string;
  size: string;
  structure: string;
};

type CatalogModelVisualCardProps = {
  actionHint: string;
  ariaLabel: string;
  imagePriority?: boolean;
  isSelected?: boolean;
  model: CatalogModelVisualCardModel;
  onClick: () => void;
  statusLabel?: string;
};

const compactModelDetails = [
  ["size", "Tamanho"],
  ["armSize", "Braço"],
  ["structure", "Estrutura"],
] as const;

function formatModelValue(value: string) {
  return value.trim() || "Não informado";
}

export function CatalogModelVisualCard({
  actionHint,
  ariaLabel,
  imagePriority = false,
  isSelected = false,
  model,
  onClick,
  statusLabel,
}: CatalogModelVisualCardProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <article
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      className={cn(
        "group flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border bg-background text-left shadow-soft transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isSelected
          ? "border-primary ring-2 ring-primary/10"
          : "border-primary/10 hover:-translate-y-1 hover:border-accent/45 hover:shadow-lift",
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        <Image
          alt={model.name}
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          fill
          priority={imagePriority}
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
          src={model.imageUrl}
          style={{ objectPosition: model.imagePosition ?? "center center" }}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/85 via-primary/45 to-transparent p-4 pt-12">
          <h2 className="font-serif text-2xl font-semibold leading-tight text-background drop-shadow-sm">
            {formatModelValue(model.name)}
          </h2>
          <p className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-background/80">
            {formatModelValue(model.category)}
          </p>
        </div>
        {statusLabel ? (
          <span className="absolute right-3 top-3 rounded-md border border-background/35 bg-background/85 px-2 py-1 text-[0.62rem] font-medium uppercase tracking-[0.12em] text-primary shadow-soft backdrop-blur">
            {statusLabel}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <dl className="grid gap-x-4 gap-y-3 sm:grid-cols-3">
          {compactModelDetails.map(([key, label]) => (
            <div
              className="border-b border-primary/10 pb-2 sm:border-b-0 sm:pb-0"
              key={key}
            >
              <dt className="text-[0.62rem] font-medium uppercase tracking-[0.12em] text-muted">
                {label}
              </dt>
              <dd className="mt-1 text-sm font-medium leading-5 text-primary sm:text-[0.82rem]">
                {formatModelValue(model[key])}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 border-t border-primary/10 pt-3">
          <p className="text-[0.62rem] font-medium uppercase tracking-[0.12em] text-muted">
            Tecido
          </p>
          <p className="mt-1 text-sm font-medium leading-5 text-primary">
            {formatModelValue(model.fabric)}
          </p>
        </div>

        <p className="mt-auto border-t border-primary/10 pt-3 text-sm font-medium text-accent transition group-hover:text-primary">
          {actionHint} →
        </p>
      </div>
    </article>
  );
}
