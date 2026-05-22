import type { Metadata, Viewport } from "next";
import { brand } from "@/constants/brand";
import { site } from "@/constants/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${brand.name}`,
  },
  description: site.description,
  keywords: [
    "Projete Estofados",
    "sofá sob medida Curitiba",
    "estofados personalizados",
    "sofás personalizados",
    "móveis premium Curitiba",
  ],
  authors: [{ name: brand.name }],
  creator: brand.name,
  icons: {
    icon: "/images/icon-cropped.png",
    shortcut: "/images/icon-cropped.png",
    apple: "/images/icon-cropped.png",
  },
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: brand.name,
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=82",
        width: 1200,
        height: 630,
        alt: "Sala sofisticada com sofá sob medida",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#32462F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
