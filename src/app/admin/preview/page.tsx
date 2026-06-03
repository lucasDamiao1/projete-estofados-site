import { redirect } from "next/navigation";
import { AdminPreviewClient } from "./AdminPreviewClient";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type SiteSectionId =
  | "inicio"
  | "sobre"
  | "inspiracoes"
  | "orcamento"
  | "contato";

type AdminPreviewPageProps = {
  searchParams: Promise<{
    section?: string | string[];
  }>;
};

const siteSectionIds = new Set<string>([
  "inicio",
  "sobre",
  "inspiracoes",
  "orcamento",
  "contato",
]);

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Preview administrativo",
};

function resolveSectionId(value: string | string[] | undefined): SiteSectionId {
  const sectionId = Array.isArray(value) ? value[0] : value;

  return siteSectionIds.has(sectionId ?? "")
    ? (sectionId as SiteSectionId)
    : "inicio";
}

export default async function AdminPreviewPage({
  searchParams,
}: AdminPreviewPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const resolvedSearchParams = await searchParams;
  const initialSection = resolveSectionId(resolvedSearchParams.section);
  const contents = await prisma.siteContent.findMany({
    select: {
      key: true,
      section: true,
      value: true,
    },
  });

  return (
    <AdminPreviewClient contents={contents} initialSection={initialSection} />
  );
}
