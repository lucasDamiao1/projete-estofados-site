"use client";

import Image from "next/image";
import { Droplets, Gem, PawPrint } from "lucide-react";
import { useEffect, useState } from "react";
import { CatalogModelCard } from "@/components/sections/CatalogModelCard";
import { fabricTags } from "@/data/catalog";
import { cn } from "@/lib/utils";
import type { CatalogFabricTag, CatalogItem, CatalogModelItem } from "@/types";

type CatalogTab = "modelos" | "tecidos";

type CatalogTabsProps = {
  fabrics: CatalogItem[];
  models: CatalogModelItem[];
};

const tabs: { id: CatalogTab; label: string }[] = [
  { id: "modelos", label: "Modelos" },
  { id: "tecidos", label: "Tecidos" },
];

const fabricTagIcons = {
  "pet-friendly": PawPrint,
  impermeavel: Droplets,
  premium: Gem,
} satisfies Record<CatalogFabricTag, typeof PawPrint>;

export function CatalogTabs({ fabrics, models }: CatalogTabsProps) {
  const [activeTab, setActiveTab] = useState<CatalogTab>("modelos");
  const [selectedFabricTags, setSelectedFabricTags] = useState<
    CatalogFabricTag[]
  >([]);

  const filteredFabrics =
    selectedFabricTags.length === 0
      ? fabrics
      : fabrics.filter((fabric) =>
          selectedFabricTags.every((tag) => fabric.tags.includes(tag)),
        );

  const toggleFabricTag = (tag: CatalogFabricTag) => {
    setSelectedFabricTags((currentTags) =>
      currentTags.includes(tag)
        ? currentTags.filter((currentTag) => currentTag !== tag)
        : [...currentTags, tag],
    );
  };

  useEffect(() => {
    const syncTabWithHash = () => {
      setActiveTab(
        window.location.hash === "#catalogo-tecidos" ? "tecidos" : "modelos",
      );
    };

    syncTabWithHash();
    window.addEventListener("hashchange", syncTabWithHash);

    return () => window.removeEventListener("hashchange", syncTabWithHash);
  }, []);

  return (
    <div className="mt-12">
      <div className="flex justify-center">
        <div
          className="inline-flex w-fit items-center rounded-lg border border-primary/15 bg-background/70 p-1 shadow-soft"
          role="tablist"
          aria-label="Categorias do catálogo"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const panelId = `catalogo-${tab.id}-panel`;

            return (
              <a
                key={tab.id}
                id={`catalogo-${tab.id}-tab`}
                href={`#catalogo-${tab.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={panelId}
                onPointerDown={() => setActiveTab(tab.id)}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveTab(tab.id);
                  }
                }}
                className={cn(
                  "flex h-11 min-w-28 items-center justify-center rounded-md px-5 text-xs font-medium uppercase tracking-[0.16em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  isActive
                    ? "bg-primary text-background shadow-soft"
                    : "text-primary/70 hover:bg-white/60 hover:text-primary",
                )}
              >
                {tab.label}
              </a>
            );
          })}
        </div>
      </div>

      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <div
            key={tab.id}
            id={`catalogo-${tab.id}-panel`}
            role="tabpanel"
            aria-labelledby={`catalogo-${tab.id}-tab`}
            hidden={!isActive}
            className="mt-8"
          >
            {isActive && tab.id === "modelos" ? (
              models.length > 0 ? (
                <div className="grid gap-6 lg:grid-cols-2">
                  {models.map((model) => (
                    <CatalogModelCard key={model.id} model={model} />
                  ))}
                </div>
              ) : (
                <p className="rounded-lg bg-background p-6 text-center text-sm leading-7 text-muted shadow-soft">
                  Nenhum modelo ativo no catalogo.
                </p>
              )
            ) : null}

            {isActive && tab.id === "tecidos" ? (
              <>
                <div
                  className="mb-6 flex flex-wrap justify-center gap-2"
                  aria-label="Filtros de tecidos"
                >
                  {fabricTags.map((tag) => {
                    const Icon = fabricTagIcons[tag.id];
                    const isSelected = selectedFabricTags.includes(tag.id);

                    return (
                      <button
                        key={tag.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleFabricTag(tag.id)}
                        className={cn(
                          "inline-flex min-h-9 items-center justify-center gap-2 rounded-md border px-4 text-xs font-medium uppercase tracking-[0.12em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                          isSelected
                            ? "border-primary bg-primary text-background shadow-soft"
                            : "border-primary/15 bg-background/70 text-primary/70 hover:border-accent hover:bg-white/70 hover:text-primary",
                        )}
                      >
                        <Icon className="size-3.5" aria-hidden="true" />
                        {tag.label}
                      </button>
                    );
                  })}
                </div>

                {filteredFabrics.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filteredFabrics.map((item) => (
                      <article
                        key={item.id}
                        className="overflow-hidden rounded-lg bg-background shadow-soft"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                            className="object-cover"
                          />
                          <div className="absolute bottom-3 right-3 flex flex-wrap justify-end gap-1.5">
                            {item.tags.map((tagId) => {
                              const tag = fabricTags.find(
                                (fabricTag) => fabricTag.id === tagId,
                              );

                              if (!tag) {
                                return null;
                              }

                              const Icon = fabricTagIcons[tag.id];

                              return (
                                <span
                                  key={tag.id}
                                  className="inline-flex items-center gap-1 rounded-md border border-primary/10 bg-background/90 px-2 py-1 text-[0.62rem] font-medium uppercase tracking-[0.1em] text-primary shadow-soft"
                                >
                                  <Icon className="size-3" aria-hidden="true" />
                                  {tag.label}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <div className="space-y-3 p-5 sm:p-6">
                          <h2 className="font-serif text-2xl font-semibold leading-tight text-primary">
                            {item.name}
                          </h2>
                          <p className="text-sm leading-7 text-muted">
                            {item.description}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-lg bg-background p-6 text-center text-sm leading-7 text-muted shadow-soft">
                    Nenhum tecido encontrado para os filtros selecionados.
                  </p>
                )}
              </>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
