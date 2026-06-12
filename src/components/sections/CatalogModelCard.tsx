import { CatalogModelVisualCard } from "@/components/sections/CatalogModelVisualCard";
import type { CatalogModelItem } from "@/types";

type CatalogModelCardProps = {
  model: CatalogModelItem;
  onQuoteClick: (model: CatalogModelItem) => void;
};

export function CatalogModelCard({
  model,
  onQuoteClick,
}: CatalogModelCardProps) {
  return (
    <CatalogModelVisualCard
      actionHint="Clique para montar seu orçamento"
      ariaLabel={`Montar orçamento para ${model.name}`}
      model={model}
      onClick={() => onQuoteClick(model)}
    />
  );
}
