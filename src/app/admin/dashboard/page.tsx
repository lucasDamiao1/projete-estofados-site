import { redirect } from "next/navigation";
import { AdminEditorLayout } from "./AdminEditorLayout";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Dashboard administrativo",
};

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const [
    contents,
    catalogModels,
    catalogFabrics,
    users,
    whatsappClickCount,
  ] = await Promise.all([
    prisma.siteContent.findMany({
      orderBy: [{ section: "asc" }, { key: "asc" }],
      select: {
        id: true,
        section: true,
        key: true,
        type: true,
        value: true,
      },
    }),
    prisma.catalogModel.findMany({
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
        active: true,
        sortOrder: true,
      },
    }),
    prisma.catalogFabric.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        imageUrl: true,
        description: true,
        tags: true,
        active: true,
        sortOrder: true,
      },
    }),
    prisma.user.findMany({
      orderBy: [{ createdAt: "desc" }, { email: "asc" }],
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    }),
    prisma.whatsappClick.count(),
  ]);

  return (
      <AdminEditorLayout
        catalogFabrics={catalogFabrics}
        catalogModels={catalogModels}
        contents={contents}
      users={users.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
      }))}
      whatsappClickCount={whatsappClickCount}
      userEmail={session.user.email}
    />
  );
}
