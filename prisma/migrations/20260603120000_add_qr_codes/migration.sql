CREATE TABLE "QrCode" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QrCode_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "QrCode_sortOrder_name_idx" ON "QrCode"("sortOrder", "name");

INSERT INTO "QrCode" ("id", "name", "targetUrl", "sortOrder", "updatedAt")
VALUES
    (
        'whatsapp',
        'WhatsApp',
        'https://wa.me/5541998705973?text=Ol%C3%A1%2C%20Projete%20Estofados!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento%20para%20um%20sof%C3%A1%20sob%20medida.',
        10,
        CURRENT_TIMESTAMP
    ),
    (
        'instagram',
        'Instagram',
        'https://www.instagram.com/projeteestofados_/',
        20,
        CURRENT_TIMESTAMP
    );
