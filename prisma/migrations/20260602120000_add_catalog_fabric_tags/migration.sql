CREATE TABLE "CatalogFabricTag" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CatalogFabricTag_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CatalogFabricTag_sortOrder_label_idx" ON "CatalogFabricTag"("sortOrder", "label");

INSERT INTO "CatalogFabricTag" ("id", "label", "icon", "sortOrder", "updatedAt")
VALUES
  ('pet-friendly', 'Pet friendly', 'paw-print', 10, CURRENT_TIMESTAMP),
  ('impermeavel', 'Impermeável', 'droplets', 20, CURRENT_TIMESTAMP),
  ('premium', 'Premium', 'gem', 30, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
