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
  imageUrl: string;
  tags: CatalogFabricTag[];
};

export type CatalogModelItem = {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  size: string;
  fabric: string;
  armSize: string;
  structure: string;
  whatsappMessage: string;
};
