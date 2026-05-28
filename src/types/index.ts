export type NavItem = {
  label: string;
  href: string;
};

export type BudgetStep = {
  title: string;
  description: string;
};

export type GalleryItem = {
  title: string;
  alt: string;
  image: string;
  orientation: "portrait" | "landscape";
};

export type CatalogFabricTag = "pet-friendly" | "impermeavel" | "premium";

export type CatalogItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  alt: string;
  tags: CatalogFabricTag[];
};

export type CatalogModelItem = {
  id: string;
  name: string;
  image: string;
  alt: string;
  category: string;
  size: string;
  fabric: string;
  armSize: string;
  structure: string;
  description: string;
  whatsappMessage: string;
};
