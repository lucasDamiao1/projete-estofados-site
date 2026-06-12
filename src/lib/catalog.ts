import { catalog, fabricTags as fallbackFabricTags } from "@/data/catalog";
import { prisma } from "@/lib/prisma";
import type {
  CatalogFabricTag,
  CatalogFabricTagItem,
  CatalogItem,
  CatalogModelItem,
} from "@/types";

export type PublicCatalog = {
  fabricTags: CatalogFabricTagItem[];
  fabrics: CatalogItem[];
  models: CatalogModelItem[];
};

function parseFabricTags(
  tags: string,
  availableTags: CatalogFabricTagItem[],
): CatalogFabricTag[] {
  const validFabricTags = new Set(availableTags.map((tag) => tag.id));

  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag): tag is CatalogFabricTag =>
      validFabricTags.has(tag as CatalogFabricTag),
    );
}

export async function getPublicCatalog(): Promise<PublicCatalog> {
  const [models, fabrics, fabricTags] = await Promise.all([
    prisma.catalogModel.findMany({
      where: {
        active: true,
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        imageUrl: true,
        category: true,
        size: true,
        fabric: true,
        armSize: true,
        structure: true,
        whatsappMessage: true,
      },
    }),
    prisma.catalogFabric.findMany({
      where: {
        active: true,
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        imageUrl: true,
        description: true,
        tags: true,
      },
    }),
    prisma.catalogFabricTag.findMany({
      orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
      select: {
        id: true,
        label: true,
        icon: true,
      },
    }),
  ]);
  const availableFabricTags =
    fabricTags.length > 0 ? fabricTags : fallbackFabricTags;

  return {
    fabricTags: availableFabricTags,
    fabrics:
      fabrics.length > 0
        ? fabrics.map((fabric) => ({
            ...fabric,
            tags: parseFabricTags(fabric.tags, availableFabricTags),
          }))
        : catalog.tecidos,
    models: models.length > 0 ? models : catalog.modelos,
  };
}

export async function getPublicCatalogModel(modelId: string) {
  const publicCatalog = await getPublicCatalog();

  return {
    ...publicCatalog,
    model:
      publicCatalog.models.find((catalogModel) => catalogModel.id === modelId) ??
      null,
  };
}
