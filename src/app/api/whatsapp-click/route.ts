import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const whatsappClickSchema = z.object({
  label: z.string().trim().min(1).max(160),
  source: z.string().trim().min(1).max(120),
  url: z.string().trim().url(),
});

const allowedWhatsappHosts = new Set([
  "api.whatsapp.com",
  "wa.me",
  "web.whatsapp.com",
]);

function parseAllowedWhatsappUrl(value: string) {
  try {
    const url = new URL(value);

    if (url.protocol !== "https:" || !allowedWhatsappHosts.has(url.hostname)) {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const parsedData = whatsappClickSchema.safeParse({
    label: request.nextUrl.searchParams.get("label"),
    source: request.nextUrl.searchParams.get("source"),
    url: request.nextUrl.searchParams.get("url"),
  });

  if (!parsedData.success) {
    return NextResponse.json(
      { error: "Parâmetros inválidos para registrar o clique." },
      { status: 400 },
    );
  }

  const redirectUrl = parseAllowedWhatsappUrl(parsedData.data.url);

  if (!redirectUrl) {
    return NextResponse.json(
      { error: "URL de WhatsApp não permitida." },
      { status: 400 },
    );
  }

  try {
    await prisma.whatsappClick.create({
      data: {
        label: parsedData.data.label,
        source: parsedData.data.source,
      },
    });
  } catch (error) {
    console.error("Failed to register WhatsApp click", error);
  }

  return NextResponse.redirect(redirectUrl);
}
