import type { GalleryItem } from "@/types";

const imageParams = "auto=format&fit=crop&q=82";

export const gallery: GalleryItem[] = [
  {
    title: "Sala integrada",
    alt: "Sala sofisticada com sofá claro e composição acolhedora",
    image: `https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?${imageParams}&w=1200`,
    orientation: "landscape",
  },
  {
    title: "Texturas naturais",
    alt: "Ambiente de interiores com sofá elegante em tons neutros",
    image: `https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?${imageParams}&w=900`,
    orientation: "portrait",
  },
  {
    title: "Conforto contemporâneo",
    alt: "Sofá contemporâneo em sala com luz natural e decoração refinada",
    image: `https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?${imageParams}&w=900`,
    orientation: "portrait",
  },
  {
    title: "Elegância sob medida",
    alt: "Sala premium com sofá modular e acabamento minimalista",
    image: `https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?${imageParams}&w=1200`,
    orientation: "landscape",
  },
];
