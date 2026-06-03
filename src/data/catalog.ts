import type { CatalogFabricTagItem, CatalogItem, CatalogModelItem } from "@/types";

const imageParams = "auto=format&fit=crop&q=82";

export const fabricTags = [
  { id: "pet-friendly", label: "Pet friendly", icon: "paw-print" },
  { id: "impermeavel", label: "Impermeável", icon: "droplets" },
  { id: "premium", label: "Premium", icon: "gem" },
] satisfies CatalogFabricTagItem[];

const catalogModels: CatalogModelItem[] = [
    {
      id: "sofa-modular",
      name: "Sofá modular",
      category: "Sofá modular sob medida",
      size: "3,20 m",
      fabric: "Linho texturizado",
      armSize: "Braço de 18 cm",
      structure: "Fixo",
      imageUrl: `https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?${imageParams}&w=1000`,
      whatsappMessage:
        "Olá! Tenho interesse no modelo Sofá modular. Gostaria de mais informações sobre medidas, tecidos e orçamento.",
    },
    {
      id: "sofa-retratil",
      name: "Sofá retrátil",
      category: "Sofá retrátil para sala",
      size: "2,80 m",
      fabric: "Veludo premium",
      armSize: "Braço de 20 cm",
      structure: "Retrátil",
      imageUrl: `https://images.unsplash.com/photo-1555041469-a586c61ea9bc?${imageParams}&w=1000`,
      whatsappMessage:
        "Olá! Tenho interesse no modelo Sofá retrátil. Gostaria de mais informações sobre medidas, tecidos e orçamento.",
    },
    {
      id: "chaise-sob-medida",
      name: "Chaise sob medida",
      category: "Sofá com chaise",
      size: "3,00 m x 1,60 m",
      fabric: "Boucle",
      armSize: "Braço de 16 cm",
      structure: "Fixo com chaise",
      imageUrl: `https://images.unsplash.com/photo-1618220179428-22790b461013?${imageParams}&w=1000`,
      whatsappMessage:
        "Olá! Tenho interesse no modelo Chaise sob medida. Gostaria de mais informações sobre medidas, tecidos e orçamento.",
    },
  ];

const catalogFabrics: CatalogItem[] = [
    {
      id: "linho-texturizado",
      name: "Linho texturizado",
      description:
        "Tecido com trama aparente e toque natural, ideal para composições leves, acolhedoras e atemporais.",
      imageUrl: "/images/catalogo/tecidos/linho.webp",
      tags: ["pet-friendly", "premium"],
    },
    {
      id: "veludo-premium",
      name: "Veludo premium",
      description:
        "Acabamento macio e elegante, indicado para projetos que pedem presença visual e sensação extra de conforto.",
      imageUrl: "/images/catalogo/tecidos/veludo.avif",
      tags: ["premium"],
    },
    {
      id: "boucle",
      name: "Boucle",
      description:
        "Textura marcante e visual contemporâneo, perfeito para destacar o sofá como peça central do ambiente.",
      imageUrl: "/images/catalogo/tecidos/boucle.webp",
      tags: ["pet-friendly", "impermeavel"],
    },
  ];

export const catalog = {
  modelos: catalogModels,
  tecidos: catalogFabrics,
};
