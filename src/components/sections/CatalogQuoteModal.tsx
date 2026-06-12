"use client";

import Image from "next/image";
import { Check, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { WhatsAppIcon } from "@/components/ui/BrandIcon";
import { Button } from "@/components/ui/Button";
import { getFabricTagIcon } from "@/lib/catalogFabricIcons";
import { cn } from "@/lib/utils";
import type {
  CatalogFabricTagItem,
  CatalogItem,
  CatalogModelItem,
} from "@/types";

type CatalogQuoteModalProps = {
  fabricTags: CatalogFabricTagItem[];
  fabrics: CatalogItem[];
  model: CatalogModelItem;
  onClose: () => void;
  whatsappNumber: string;
};

const inputClassName =
  "mt-2 min-h-11 w-full rounded-md border border-primary/15 bg-background px-3 text-sm text-primary shadow-sm transition placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25";

const textareaClassName =
  "mt-2 min-h-28 w-full rounded-md border border-primary/15 bg-background px-3 py-3 text-sm leading-6 text-primary shadow-sm transition placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function getInitialFabric(fabrics: CatalogItem[], modelFabric: string) {
  return (
    fabrics.find(
      (fabric) => normalizeText(fabric.name) === normalizeText(modelFabric)
    ) ??
    fabrics[0] ??
    null
  );
}

export function CatalogQuoteModal({
  fabricTags,
  fabrics,
  model,
  onClose,
  whatsappNumber,
}: CatalogQuoteModalProps) {
  const initialFabric = useMemo(
    () => getInitialFabric(fabrics, model.fabric),
    [fabrics, model.fabric]
  );
  const [measurements, setMeasurements] = useState(model.size);
  const [armSize, setArmSize] = useState(model.armSize);
  const [selectedFabric, setSelectedFabric] = useState<CatalogItem | null>(
    initialFabric
  );
  const [observation, setObservation] = useState("");
  const [isFabricPanelOpen, setIsFabricPanelOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isFabricPanelOpen) {
          setIsFabricPanelOpen(false);
          return;
        }

        onClose();
      }
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFabricPanelOpen, onClose]);

  const selectedFabricName = selectedFabric?.name ?? "";
  const quoteMessage = useMemo(() => {
    const observationText = observation.trim() || "Sem observações adicionais.";

    return `Olá! Gostaria de solicitar um orçamento com base neste modelo:

Modelo: ${model.name}
Medidas desejadas: ${measurements.trim()}
Tamanho do braço: ${armSize.trim()}
Tecido escolhido: ${selectedFabricName.trim()}

Observações:
${observationText}

Aguardo o contato para confirmar os detalhes e valores. Obrigado!`;
  }, [armSize, measurements, model.name, observation, selectedFabricName]);

  const canSend = Boolean(
    measurements.trim() && armSize.trim() && selectedFabricName.trim()
  );
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    quoteMessage
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-dark/55 px-3 py-4 backdrop-blur-sm sm:items-center sm:px-6"
      onMouseDown={onClose}
    >
      <section
        aria-labelledby="catalog-quote-title"
        aria-modal="true"
        role="dialog"
        className="relative flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg bg-background shadow-lift"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="relative flex h-16 items-center justify-center border-b border-primary/10 bg-background text-primary">
          <div className="absolute left-4 flex items-center">
            <div className="relative h-7 w-[129px] sm:h-8 sm:w-[148px]">
              <Image
                src="/images/logo-navbar.png"
                alt="Projete Estofados"
                fill
                priority
                sizes="(min-width: 640px) 148px, 129px"
                className="object-contain object-left"
              />
            </div>
          </div>

          <h2
            id="catalog-quote-title"
            className="font-serif text-lg font-semibold sm:text-xl"
          >
            Montar orçamento
          </h2>

          <button
            type="button"
            aria-label="Fechar orçamento"
            onClick={onClose}
            className="absolute right-3 inline-flex size-8 items-center justify-center rounded-md text-primary transition hover:bg-primary/5"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] overflow-hidden lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:grid-rows-1">
          <div className="h-56 border-b border-primary/10 sm:h-64 lg:h-full lg:border-b-0 lg:border-r">
            <div className="relative h-full overflow-hidden">
              <Image
                src={model.imageUrl}
                alt={model.name}
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto p-4 sm:p-6">
            <div className="mb-5 rounded-md border border-primary/10 bg-surface/35 px-4 py-3">
              <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-accent">
                Modelo selecionado
              </p>
              <p className="mt-1 font-serif text-2xl font-semibold leading-tight text-primary">
                {model.name}
              </p>
              <p className="mt-1 text-sm leading-6 text-muted">
                {model.category}
              </p>
            </div>

            <form className="space-y-5">
              <label
                className="block text-sm font-medium text-primary"
                htmlFor="quote-measurements"
              >
                Medidas desejadas
                <input
                  id="quote-measurements"
                  name="measurements"
                  value={measurements}
                  onChange={(event) => setMeasurements(event.target.value)}
                  className={inputClassName}
                  placeholder="Ex.: 2,80 m x 1,60 m"
                  required
                />
                <span className="mt-1 block text-xs leading-5 text-muted">
                  Informe largura total e profundidade quando houver chaise ou
                  canto.
                </span>
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label
                  className="block text-sm font-medium text-primary"
                  htmlFor="quote-arm-size"
                >
                  Tamanho do braço
                  <input
                    id="quote-arm-size"
                    name="armSize"
                    value={armSize}
                    onChange={(event) => setArmSize(event.target.value)}
                    className={inputClassName}
                    placeholder="Ex.: 18 cm"
                    required
                  />
                </label>

                <div>
                  <span className="block text-sm font-medium text-primary">
                    Tecido escolhido
                  </span>
                  <button
                    type="button"
                    aria-expanded={isFabricPanelOpen}
                    aria-controls="quote-fabric-panel"
                    onClick={() => setIsFabricPanelOpen(true)}
                    className="mt-2 flex min-h-11 w-full items-center justify-between gap-3 rounded-md border border-primary/15 bg-background px-3 text-left text-sm text-primary shadow-sm transition hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium">
                        {selectedFabricName || "Selecionar tecido"}
                      </span>
                      <span className="block text-xs text-muted">
                        Abrir catálogo de tecidos
                      </span>
                    </span>
                    <ChevronRight
                      aria-hidden="true"
                      className="size-4 shrink-0"
                    />
                  </button>
                </div>
              </div>

              <label
                className="block text-sm font-medium text-primary"
                htmlFor="quote-observation"
              >
                Observações
                <textarea
                  id="quote-observation"
                  name="observation"
                  value={observation}
                  onChange={(event) => setObservation(event.target.value)}
                  className={textareaClassName}
                  placeholder="Ex.: quero assento mais firme, pés em madeira ou outra preferência."
                />
              </label>
            </form>

            <div className="mt-6 border-t border-primary/10 pt-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                Preview da mensagem
              </h3>
              <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-md border border-primary/10 bg-surface/45 p-4 font-sans text-sm leading-6 text-primary">
                {quoteMessage}
              </pre>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-primary/10 bg-background px-4 py-3 shadow-[0_-12px_35px_rgba(50,70,47,0.08)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-xs leading-5 text-muted">
            Revise as informações e envie a mensagem pronta para a loja.
          </p>
          {canSend ? (
            <Button asChild className="w-full sm:w-auto">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                aria-label={`Enviar orçamento para ${model.name} pelo WhatsApp`}
              >
                <WhatsAppIcon className="size-4" />
                Enviar pelo WhatsApp
              </a>
            </Button>
          ) : (
            <Button className="w-full sm:w-auto" disabled type="button">
              <WhatsAppIcon className="size-4" />
              Enviar pelo WhatsApp
            </Button>
          )}
        </div>

        <aside
          id="quote-fabric-panel"
          className={cn(
            "absolute bottom-[7.75rem] right-0 top-16 z-10 flex w-full max-w-sm flex-col overflow-hidden border-l border-primary/10 bg-background shadow-lift transition-transform duration-300 sm:bottom-[4.75rem]",
            isFabricPanelOpen ? "translate-x-0" : "translate-x-full"
          )}
          aria-hidden={!isFabricPanelOpen}
        >
          <div className="flex items-center justify-between border-b border-primary/10 px-4 py-3">
            <div>
              <p className="text-[0.62rem] font-medium uppercase tracking-[0.22em] text-accent">
                Tecidos
              </p>
              <h3 className="mt-1 font-serif text-2xl font-semibold text-primary">
                Selecionar tecido
              </h3>
            </div>
            <button
              type="button"
              aria-label="Fechar seleção de tecidos"
              onClick={() => setIsFabricPanelOpen(false)}
              className="inline-flex size-10 items-center justify-center rounded-md border border-primary/10 text-primary transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>

          <div className="grid min-h-0 flex-1 gap-3 overflow-y-auto p-4">
            {fabrics.map((fabric) => {
              const isSelected = selectedFabric?.id === fabric.id;

              return (
                <button
                  key={fabric.id}
                  type="button"
                  onClick={() => {
                    setSelectedFabric(fabric);
                    setIsFabricPanelOpen(false);
                  }}
                  className={cn(
                    "grid grid-cols-[4.75rem_1fr_auto] items-center gap-3 rounded-lg border bg-background p-2 text-left shadow-sm transition hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    isSelected
                      ? "border-primary ring-2 ring-primary/15"
                      : "border-primary/10"
                  )}
                >
                  <span className="relative block aspect-square overflow-hidden rounded-md bg-surface">
                    <Image
                      src={fabric.imageUrl}
                      alt={fabric.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </span>

                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-primary">
                      {fabric.name}
                    </span>
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      {fabric.tags.map((tagId) => {
                        const tag = fabricTags.find(
                          (fabricTag) => fabricTag.id === tagId
                        );

                        if (!tag) {
                          return null;
                        }

                        const Icon = getFabricTagIcon(tag.icon);

                        return (
                          <span
                            key={tag.id}
                            aria-label={tag.label}
                            className="inline-flex size-6 items-center justify-center rounded-md border border-primary/10 bg-surface/70 text-primary"
                            title={tag.label}
                          >
                            <Icon aria-hidden="true" className="size-3.5" />
                          </span>
                        );
                      })}
                    </span>
                  </span>

                  <span
                    className={cn(
                      "inline-flex size-7 items-center justify-center rounded-md border",
                      isSelected
                        ? "border-primary bg-primary text-background"
                        : "border-primary/10 text-primary/30"
                    )}
                  >
                    {isSelected ? (
                      <Check aria-hidden="true" className="size-4" />
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>
      </section>
    </div>
  );
}
