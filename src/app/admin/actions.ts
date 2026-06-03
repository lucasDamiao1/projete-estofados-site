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
const catalogFabricTagIconIds = [
  "paw-print",
  "droplets",
  "gem",
  "shield-check",
  "sparkles",
  "sofa",
  "feather",
  "leaf",
  "waves",
  "sun",
  "snowflake",
  "flame",
] as const;

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
        value: z.string().max(5000, "O texto deve ter no máximo 5000 caracteres."),
      }),
    )
    .min(1, "Nenhum campo foi enviado para salvar."),
});

const uploadSiteContentImageSchema = z.object({
  section: editableSectionSchema,
  contentId: z.string().min(1, "Imagem inválida."),
});

const optionalIdSchema = z
  .string()
  .trim()
  .transform((value) => value || undefined)
  .optional();

const catalogModelSchema = z.object({
  id: optionalIdSchema,
  name: z.string().trim().min(1, "Informe o nome do modelo.").max(120),
  imageUrl: z.string().trim().max(1000),
  category: z.string().trim().min(1, "Informe a categoria.").max(160),
  size: z.string().trim().min(1, "Informe o tamanho.").max(80),
  fabric: z.string().trim().min(1, "Informe o tecido.").max(120),
  armSize: z.string().trim().min(1, "Informe o tamanho do braço.").max(80),
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
  imageUrl: z.string().trim().max(1000),
  description: z.string().trim().min(1, "Informe a descrição.").max(1000),
  tags: z.array(z.string().trim().min(1).max(80)).max(20),
  active: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(999999),
});

const catalogItemIdSchema = z.object({
  id: z.string().min(1, "Item inválido."),
});

const catalogFabricTagSchema = z.object({
  label: z.string().trim().min(1, "Informe o nome da tag.").max(60),
  icon: z.enum(catalogFabricTagIconIds, {
    message: "Selecione um ícone válido.",
  }),
});

const catalogFabricTagIdSchema = z.object({
  id: z.string().trim().min(1, "Tag inválida.").max(80),
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
    return "A imagem deve ter no máximo 4 MB.";
  }

  return null;
}

async function uploadCatalogImage(
  file: File,
  directory: "fabrics" | "models",
) {
  const pathname = [
    "catalog",
    directory,
    `${Date.now()}-${sanitizeFileName(file.name)}`,
  ].join("/");
  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });

  return blob.url;
}

function parseCatalogTags(formData: FormData) {
  return [
    ...new Set(
      formData
        .getAll("tags")
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  ];
}

function slugifyTagLabel(label: string) {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function removeTagFromSerializedTags(tags: string, tagId: string) {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag && tag !== tagId)
    .join(",");
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
        error: "E-mail ou senha inválidos.",
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
      error: "Sessão expirada. Faça login novamente para salvar.",
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
      error: parsedData.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const uniqueIds = new Set(parsedData.data.updates.map((update) => update.id));

  if (uniqueIds.size !== parsedData.data.updates.length) {
    return {
      error: "Há campos duplicados no formulário.",
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
      error: "Um ou mais campos não pertencem à seção selecionada.",
    };
  }

  const nonEditableRecord = records.find(
    (record) => record.type !== "text" && record.type !== "textarea",
  );

  if (nonEditableRecord) {
    return {
      error: "Campos de imagem ou link ainda não podem ser salvos.",
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
    success: "Conteúdo salvo com sucesso.",
  };
}

export async function uploadSiteContentImageAction(
  _previousState: UploadSiteContentImageState,
  formData: FormData,
): Promise<UploadSiteContentImageState> {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "Sessão expirada. Faça login novamente para enviar imagens.",
    };
  }

  const parsedData = uploadSiteContentImageSchema.safeParse({
    section: formData.get("section"),
    contentId: formData.get("contentId"),
  });

  if (!parsedData.success) {
    return {
      error: parsedData.error.issues[0]?.message ?? "Dados inválidos.",
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
      error: "Imagem não encontrada para a seção selecionada.",
    };
  }

  if (record.type !== "image") {
    return {
      error: "Este campo não aceita upload de imagem.",
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
      error: "Não foi possível enviar a imagem. Verifique o Blob token e tente novamente.",
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
      error: "Sessão expirada. Faça login novamente para salvar.",
    };
  }

  const imageFile = formData.get("image");
  const currentImageUrl = formData.get("imageUrl");
  const parsedData = catalogModelSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    imageUrl: currentImageUrl,
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
      error: parsedData.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const { id, ...data } = parsedData.data;
  let imageUrl = data.imageUrl;

  if (imageFile instanceof File && imageFile.size > 0) {
    const imageError = validateImageFile(imageFile);

    if (imageError) {
      return {
        error: imageError,
      };
    }

    try {
      imageUrl = await uploadCatalogImage(imageFile, "models");
    } catch (error) {
      console.error(error);

      return {
        error: "Não foi possível enviar a imagem. Verifique o Blob token e tente novamente.",
      };
    }
  }

  if (!imageUrl) {
    return {
      error: "Selecione uma imagem para salvar o modelo.",
    };
  }

  if (id) {
    const updatedModel = await prisma.catalogModel.updateMany({
      where: { id },
      data: {
        ...data,
        imageUrl,
      },
    });

    if (updatedModel.count === 0) {
      return {
        error: "Modelo não encontrado.",
      };
    }
  } else {
    await prisma.catalogModel.create({
      data: {
        ...data,
        imageUrl,
      },
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
      error: "Sessão expirada. Faça login novamente para salvar.",
    };
  }

  const imageFile = formData.get("image");
  const parsedData = catalogFabricSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    imageUrl: formData.get("imageUrl"),
    description: formData.get("description"),
    tags: parseCatalogTags(formData),
    active: formData.get("active") === "on",
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsedData.success) {
    return {
      error: parsedData.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const { id, tags, ...data } = parsedData.data;
  const availableTags = await prisma.catalogFabricTag.findMany({
    select: {
      id: true,
    },
  });
  const availableTagIds = new Set(availableTags.map((tag) => tag.id));
  const invalidTag = tags.find((tag) => !availableTagIds.has(tag));

  if (invalidTag) {
    return {
      error: "Uma ou mais tags selecionadas não existem.",
    };
  }

  let imageUrl = data.imageUrl;
  const serializedTags = tags.join(",");

  if (imageFile instanceof File && imageFile.size > 0) {
    const imageError = validateImageFile(imageFile);

    if (imageError) {
      return {
        error: imageError,
      };
    }

    try {
      imageUrl = await uploadCatalogImage(imageFile, "fabrics");
    } catch (error) {
      console.error(error);

      return {
        error: "Não foi possível enviar a imagem. Verifique o Blob token e tente novamente.",
      };
    }
  }

  if (!imageUrl) {
    return {
      error: "Selecione uma imagem para salvar o tecido.",
    };
  }

  if (id) {
    const updatedFabric = await prisma.catalogFabric.updateMany({
      where: { id },
      data: {
        ...data,
        imageUrl,
        tags: serializedTags,
      },
    });

    if (updatedFabric.count === 0) {
      return {
        error: "Tecido não encontrado.",
      };
    }
  } else {
    await prisma.catalogFabric.create({
      data: {
        ...data,
        imageUrl,
        tags: serializedTags,
      },
    });
  }

  revalidateCatalogPaths();

  return {
    success: id ? "Tecido atualizado com sucesso." : "Tecido criado com sucesso.",
  };
}

export async function createCatalogFabricTagAction(
  _previousState: CatalogActionState,
  formData: FormData,
): Promise<CatalogActionState> {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "Sessão expirada. Faça login novamente para salvar.",
    };
  }

  const parsedData = catalogFabricTagSchema.safeParse({
    label: formData.get("label"),
    icon: formData.get("icon"),
  });

  if (!parsedData.success) {
    return {
      error: parsedData.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const id = slugifyTagLabel(parsedData.data.label);

  if (!id) {
    return {
      error: "Informe um nome de tag válido.",
    };
  }

  const existingTag = await prisma.catalogFabricTag.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (existingTag) {
    return {
      error: "Já existe uma tag com esse nome.",
    };
  }

  const lastTag = await prisma.catalogFabricTag.findFirst({
    orderBy: {
      sortOrder: "desc",
    },
    select: {
      sortOrder: true,
    },
  });

  await prisma.catalogFabricTag.create({
    data: {
      id,
      icon: parsedData.data.icon,
      label: parsedData.data.label,
      sortOrder: (lastTag?.sortOrder ?? 0) + 10,
    },
  });

  revalidateCatalogPaths();

  return {
    success: "Tag criada com sucesso.",
  };
}

export async function deleteCatalogFabricTagAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return;
  }

  const parsedData = catalogFabricTagIdSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsedData.success) {
    return;
  }

  await prisma.$transaction(async (transaction) => {
    const fabrics = await transaction.catalogFabric.findMany({
      where: {
        tags: {
          contains: parsedData.data.id,
        },
      },
      select: {
        id: true,
        tags: true,
      },
    });

    await Promise.all(
      fabrics.map((fabric) =>
        transaction.catalogFabric.update({
          where: {
            id: fabric.id,
          },
          data: {
            tags: removeTagFromSerializedTags(fabric.tags, parsedData.data.id),
          },
        }),
      ),
    );

    await transaction.catalogFabricTag.deleteMany({
      where: {
        id: parsedData.data.id,
      },
    });
  });

  revalidateCatalogPaths();
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
