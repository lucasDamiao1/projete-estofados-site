"use server";

import { put } from "@vercel/blob";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";

export type LoginState = {
  error?: string;
};

export type SaveSiteContentState = {
  error?: string;
  success?: string;
};

export type UploadSiteContentImageState = {
  error?: string;
  success?: string;
  url?: string;
};

export type CatalogActionState = {
  error?: string;
  success?: string;
};

const maxImageSize = 4 * 1024 * 1024;
const allowedImageTypes = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const editableSectionSchema = z.enum([
  "inicio",
  "sobre",
  "inspiracoes",
  "orcamento",
  "contato",
]);

const saveSiteContentSchema = z.object({
  section: editableSectionSchema,
  updates: z
    .array(
      z.object({
        id: z.string().min(1),
        value: z.string().max(5000, "O texto deve ter no maximo 5000 caracteres."),
      }),
    )
    .min(1, "Nenhum campo foi enviado para salvar."),
});

const uploadSiteContentImageSchema = z.object({
  section: editableSectionSchema,
  contentId: z.string().min(1, "Imagem invalida."),
});

const optionalIdSchema = z
  .string()
  .trim()
  .transform((value) => value || undefined)
  .optional();

const catalogModelSchema = z.object({
  id: optionalIdSchema,
  name: z.string().trim().min(1, "Informe o nome do modelo.").max(120),
  imageUrl: z.string().trim().min(1, "Informe a URL da imagem.").max(1000),
  category: z.string().trim().min(1, "Informe a categoria.").max(160),
  size: z.string().trim().min(1, "Informe o tamanho.").max(80),
  fabric: z.string().trim().min(1, "Informe o tecido.").max(120),
  armSize: z.string().trim().min(1, "Informe o tamanho do braco.").max(80),
  structure: z.string().trim().min(1, "Informe a estrutura.").max(120),
  whatsappMessage: z
    .string()
    .trim()
    .min(1, "Informe a mensagem do WhatsApp.")
    .max(1000),
  active: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(999999),
});

const catalogFabricSchema = z.object({
  id: optionalIdSchema,
  name: z.string().trim().min(1, "Informe o nome do tecido.").max(120),
  imageUrl: z.string().trim().min(1, "Informe a URL da imagem.").max(1000),
  description: z.string().trim().min(1, "Informe a descricao.").max(1000),
  tags: z.string().trim().max(240),
  active: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(999999),
});

const catalogItemIdSchema = z.object({
  id: z.string().min(1, "Item invalido."),
});

function revalidateCatalogPaths() {
  revalidatePath("/admin/dashboard");
  revalidatePath("/catalogo");
}

function revalidateSiteContentPaths() {
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

function sanitizeFileName(fileName: string) {
  const sanitizedName = fileName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return sanitizedName || "image";
}

function validateImageFile(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) {
    return "Selecione uma imagem para enviar.";
  }

  if (!allowedImageTypes.has(file.type)) {
    return "Envie uma imagem JPG, PNG, WebP ou AVIF.";
  }

  if (file.size > maxImageSize) {
    return "A imagem deve ter no maximo 4 MB.";
  }

  return null;
}

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "E-mail ou senha invalidos.",
      };
    }

    throw error;
  }

  return {};
}

export async function logoutAction() {
  await signOut({
    redirectTo: "/admin/login",
  });
}

export async function saveSiteContentAction(
  _previousState: SaveSiteContentState,
  formData: FormData,
): Promise<SaveSiteContentState> {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "Sessao expirada. Faca login novamente para salvar.",
    };
  }

  const contentIds = formData
    .getAll("contentId")
    .filter((value): value is string => typeof value === "string");

  const parsedData = saveSiteContentSchema.safeParse({
    section: formData.get("section"),
    updates: contentIds.map((id) => ({
      id,
      value: formData.get(`value:${id}`),
    })),
  });

  if (!parsedData.success) {
    return {
      error: parsedData.error.issues[0]?.message ?? "Dados invalidos.",
    };
  }

  const uniqueIds = new Set(parsedData.data.updates.map((update) => update.id));

  if (uniqueIds.size !== parsedData.data.updates.length) {
    return {
      error: "Ha campos duplicados no formulario.",
    };
  }

  const records = await prisma.siteContent.findMany({
    where: {
      id: {
        in: [...uniqueIds],
      },
      section: parsedData.data.section,
    },
    select: {
      id: true,
      type: true,
    },
  });

  if (records.length !== parsedData.data.updates.length) {
    return {
      error: "Um ou mais campos nao pertencem a secao selecionada.",
    };
  }

  const nonEditableRecord = records.find(
    (record) => record.type !== "text" && record.type !== "textarea",
  );

  if (nonEditableRecord) {
    return {
      error: "Campos de imagem ou link ainda nao podem ser salvos.",
    };
  }

  await prisma.$transaction(
    parsedData.data.updates.map((update) =>
      prisma.siteContent.update({
        where: {
          id: update.id,
        },
        data: {
          value: update.value,
        },
      }),
    ),
  );

  revalidateSiteContentPaths();

  return {
    success: "Conteudo salvo com sucesso.",
  };
}

export async function uploadSiteContentImageAction(
  _previousState: UploadSiteContentImageState,
  formData: FormData,
): Promise<UploadSiteContentImageState> {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "Sessao expirada. Faca login novamente para enviar imagens.",
    };
  }

  const parsedData = uploadSiteContentImageSchema.safeParse({
    section: formData.get("section"),
    contentId: formData.get("contentId"),
  });

  if (!parsedData.success) {
    return {
      error: parsedData.error.issues[0]?.message ?? "Dados invalidos.",
    };
  }

  const imageFile = formData.get("image");
  const imageError = validateImageFile(imageFile);

  if (imageError) {
    return {
      error: imageError,
    };
  }

  const record = await prisma.siteContent.findFirst({
    where: {
      id: parsedData.data.contentId,
      section: parsedData.data.section,
    },
    select: {
      id: true,
      key: true,
      section: true,
      type: true,
    },
  });

  if (!record) {
    return {
      error: "Imagem nao encontrada para a secao selecionada.",
    };
  }

  if (record.type !== "image") {
    return {
      error: "Este campo nao aceita upload de imagem.",
    };
  }

  const file = imageFile as File;
  const pathname = [
    "site-content",
    record.section,
    record.key,
    `${Date.now()}-${sanitizeFileName(file.name)}`,
  ].join("/");

  try {
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });

    await prisma.siteContent.update({
      where: {
        id: record.id,
      },
      data: {
        value: blob.url,
      },
    });

    revalidateSiteContentPaths();

    return {
      success: "Imagem atualizada com sucesso.",
      url: blob.url,
    };
  } catch (error) {
    console.error(error);

    return {
      error: "Nao foi possivel enviar a imagem. Verifique o Blob token e tente novamente.",
    };
  }
}

export async function saveCatalogModelAction(
  _previousState: CatalogActionState,
  formData: FormData,
): Promise<CatalogActionState> {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "Sessao expirada. Faca login novamente para salvar.",
    };
  }

  const parsedData = catalogModelSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    imageUrl: formData.get("imageUrl"),
    category: formData.get("category"),
    size: formData.get("size"),
    fabric: formData.get("fabric"),
    armSize: formData.get("armSize"),
    structure: formData.get("structure"),
    whatsappMessage: formData.get("whatsappMessage"),
    active: formData.get("active") === "on",
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsedData.success) {
    return {
      error: parsedData.error.issues[0]?.message ?? "Dados invalidos.",
    };
  }

  const { id, ...data } = parsedData.data;

  if (id) {
    const updatedModel = await prisma.catalogModel.updateMany({
      where: { id },
      data,
    });

    if (updatedModel.count === 0) {
      return {
        error: "Modelo nao encontrado.",
      };
    }
  } else {
    await prisma.catalogModel.create({
      data,
    });
  }

  revalidateCatalogPaths();

  return {
    success: id ? "Modelo atualizado com sucesso." : "Modelo criado com sucesso.",
  };
}

export async function toggleCatalogModelAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return;
  }

  const parsedData = catalogItemIdSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsedData.success) {
    return;
  }

  const model = await prisma.catalogModel.findUnique({
    where: {
      id: parsedData.data.id,
    },
    select: {
      active: true,
    },
  });

  if (!model) {
    return;
  }

  await prisma.catalogModel.update({
    where: {
      id: parsedData.data.id,
    },
    data: {
      active: !model.active,
    },
  });

  revalidateCatalogPaths();
}

export async function deleteCatalogModelAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return;
  }

  const parsedData = catalogItemIdSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsedData.success) {
    return;
  }

  await prisma.catalogModel.deleteMany({
    where: {
      id: parsedData.data.id,
    },
  });

  revalidateCatalogPaths();
}

export async function saveCatalogFabricAction(
  _previousState: CatalogActionState,
  formData: FormData,
): Promise<CatalogActionState> {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "Sessao expirada. Faca login novamente para salvar.",
    };
  }

  const parsedData = catalogFabricSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    imageUrl: formData.get("imageUrl"),
    description: formData.get("description"),
    tags: formData.get("tags"),
    active: formData.get("active") === "on",
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsedData.success) {
    return {
      error: parsedData.error.issues[0]?.message ?? "Dados invalidos.",
    };
  }

  const { id, ...data } = parsedData.data;

  if (id) {
    const updatedFabric = await prisma.catalogFabric.updateMany({
      where: { id },
      data,
    });

    if (updatedFabric.count === 0) {
      return {
        error: "Tecido nao encontrado.",
      };
    }
  } else {
    await prisma.catalogFabric.create({
      data,
    });
  }

  revalidateCatalogPaths();

  return {
    success: id ? "Tecido atualizado com sucesso." : "Tecido criado com sucesso.",
  };
}

export async function toggleCatalogFabricAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return;
  }

  const parsedData = catalogItemIdSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsedData.success) {
    return;
  }

  const fabric = await prisma.catalogFabric.findUnique({
    where: {
      id: parsedData.data.id,
    },
    select: {
      active: true,
    },
  });

  if (!fabric) {
    return;
  }

  await prisma.catalogFabric.update({
    where: {
      id: parsedData.data.id,
    },
    data: {
      active: !fabric.active,
    },
  });

  revalidateCatalogPaths();
}

export async function deleteCatalogFabricAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return;
  }

  const parsedData = catalogItemIdSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsedData.success) {
    return;
  }

  await prisma.catalogFabric.deleteMany({
    where: {
      id: parsedData.data.id,
    },
  });

  revalidateCatalogPaths();
}
