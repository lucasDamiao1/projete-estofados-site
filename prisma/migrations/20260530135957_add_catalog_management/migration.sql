-- CreateTable
CREATE TABLE "CatalogModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "fabric" TEXT NOT NULL,
    "armSize" TEXT NOT NULL,
    "structure" TEXT NOT NULL,
    "whatsappMessage" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CatalogModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatalogFabric" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CatalogFabric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CatalogModel_active_sortOrder_idx" ON "CatalogModel"("active", "sortOrder");

-- CreateIndex
CREATE INDEX "CatalogFabric_active_sortOrder_idx" ON "CatalogFabric"("active", "sortOrder");
