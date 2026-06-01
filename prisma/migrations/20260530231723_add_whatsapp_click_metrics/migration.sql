-- CreateTable
CREATE TABLE "WhatsappClick" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhatsappClick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WhatsappClick_source_idx" ON "WhatsappClick"("source");

-- CreateIndex
CREATE INDEX "WhatsappClick_createdAt_idx" ON "WhatsappClick"("createdAt");
