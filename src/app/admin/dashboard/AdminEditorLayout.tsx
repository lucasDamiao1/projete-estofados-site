"use client";

import Image from "next/image";
import {
  Contact,
  Home,
  Images,
  LayoutDashboard,
  LogOut,
  Palette,
  Plus,
  Power,
  Save,
  ScrollText,
  Sofa,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import type { ComponentType } from "react";
import { useActionState, useMemo, useState } from "react";
import {
  deleteCatalogFabricAction,
  deleteCatalogModelAction,
  logoutAction,
  saveCatalogFabricAction,
  saveCatalogModelAction,
  saveSiteContentAction,
  toggleCatalogFabricAction,
  toggleCatalogModelAction,
  uploadSiteContentImageAction,
  type CatalogActionState,
  type SaveSiteContentState,
  type UploadSiteContentImageState,
} from "../actions";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type AdminSectionId =
  | "inicio"
  | "sobre"
  | "inspiracoes"
  | "orcamento"
  | "modelos"
  | "tecidos"
  | "contato"
  | "usuarios";

export type EditableSiteContent = {
  id: string;
  section: string;
  key: string;
  type: string;
  value: string;
};

export type EditableCatalogModel = {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  size: string;
  fabric: string;
  armSize: string;
  structure: string;
  whatsappMessage: string;
  active: boolean;
  sortOrder: number;
};

export type EditableCatalogFabric = {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  tags: string;
  active: boolean;
  sortOrder: number;
};

type AdminSection = {
  id: AdminSectionId;
  label: string;
  description: string;
  editable: boolean;
  previewPath: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

type FieldMeta = {
  label: string;
  order: number;
};

const textEditableTypes = new Set(["text", "textarea"]);

const fieldMetadata: Record<string, FieldMeta> = {
  "inicio.eyebrow": { label: "Chamada superior", order: 10 },
  "inicio.hero_title": { label: "Titulo principal", order: 20 },
  "inicio.hero_image": { label: "Imagem principal", order: 30 },
  "inicio.hero_footer": { label: "Texto inferior", order: 40 },
  "sobre.eyebrow": { label: "Chamada superior", order: 10 },
  "sobre.title": { label: "Titulo", order: 20 },
  "sobre.image": { label: "Imagem institucional", order: 30 },
  "sobre.description": { label: "Descricao", order: 40 },
  "sobre.stat_1_title": { label: "Destaque 1", order: 50 },
  "sobre.stat_1_label": { label: "Rotulo do destaque 1", order: 60 },
  "sobre.stat_2_title": { label: "Destaque 2", order: 70 },
  "sobre.stat_2_label": { label: "Rotulo do destaque 2", order: 80 },
  "sobre.stat_3_title": { label: "Destaque 3", order: 90 },
  "sobre.stat_3_label": { label: "Rotulo do destaque 3", order: 100 },
  "inspiracoes.eyebrow": { label: "Chamada superior", order: 10 },
  "inspiracoes.title": { label: "Titulo", order: 20 },
  "inspiracoes.description": { label: "Descricao", order: 30 },
  "inspiracoes.catalog_text": { label: "Texto do catalogo", order: 40 },
  "inspiracoes.gallery_1_image": { label: "Imagem da galeria 1", order: 50 },
  "inspiracoes.gallery_2_image": { label: "Imagem da galeria 2", order: 60 },
  "inspiracoes.gallery_3_image": { label: "Imagem da galeria 3", order: 70 },
  "inspiracoes.gallery_4_image": { label: "Imagem da galeria 4", order: 80 },
  "orcamento.eyebrow": { label: "Chamada superior", order: 10 },
  "orcamento.title": { label: "Titulo", order: 20 },
  "orcamento.description": { label: "Descricao", order: 30 },
  "contato.eyebrow": { label: "Chamada superior", order: 10 },
  "contato.title": { label: "Titulo", order: 20 },
  "contato.description": { label: "Descricao", order: 30 },
  "contato.primary_cta": { label: "Botao principal", order: 40 },
  "contato.secondary_cta": { label: "Botao secundario", order: 50 },
  "contato.address_title": { label: "Titulo do endereco", order: 60 },
  "contato.hours_title": { label: "Titulo do horario", order: 70 },
  "contato.social_title": { label: "Titulo das redes sociais", order: 80 },
};

const adminSections: AdminSection[] = [
  {
    id: "inicio",
    label: "Inicio",
    description: "Destaque principal da pagina inicial.",
    editable: true,
    previewPath: "/#inicio",
    icon: Home,
  },
  {
    id: "sobre",
    label: "Sobre",
    description: "Bloco institucional e diferenciais da marca.",
    editable: true,
    previewPath: "/#sobre",
    icon: ScrollText,
  },
  {
    id: "inspiracoes",
    label: "Inspiracoes",
    description: "Galeria visual exibida na landing page.",
    editable: true,
    previewPath: "/#inspiracoes",
    icon: Images,
  },
  {
    id: "orcamento",
    label: "Orcamento",
    description: "Textos de orientacao para solicitar orcamento.",
    editable: true,
    previewPath: "/#orcamento",
    icon: ScrollText,
  },
  {
    id: "modelos",
    label: "Modelos",
    description: "Preview do catalogo de modelos.",
    editable: true,
    previewPath: "/catalogo",
    icon: Sofa,
  },
  {
    id: "tecidos",
    label: "Tecidos",
    description: "Preview das opcoes de revestimento.",
    editable: true,
    previewPath: "/catalogo",
    icon: Palette,
  },
  {
    id: "contato",
    label: "Contato",
    description: "Informacoes comerciais e canais de atendimento.",
    editable: true,
    previewPath: "/#contato",
    icon: Contact,
  },
  {
    id: "usuarios",
    label: "Usuarios",
    description: "Area reservada para gestao futura de acessos.",
    editable: false,
    previewPath: "/#inicio",
    icon: Users,
  },
];

type AdminEditorLayoutProps = {
  catalogFabrics: EditableCatalogFabric[];
  catalogModels: EditableCatalogModel[];
  contents: EditableSiteContent[];
  userEmail?: string | null;
};

const inputClassName =
  "min-h-10 w-full rounded-md border border-primary/10 bg-white px-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";
const textareaClassName =
  "min-h-24 w-full resize-none rounded-md border border-primary/10 bg-white px-3 py-3 text-sm leading-6 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";
const labelClassName = "block space-y-1.5 text-sm font-medium text-foreground";
const initialSaveState: SaveSiteContentState = {};
const initialUploadState: UploadSiteContentImageState = {};
const initialCatalogState: CatalogActionState = {};

function getFieldMeta(content: EditableSiteContent): FieldMeta {
  const key = `${content.section}.${content.key}`;

  return (
    fieldMetadata[key] ?? {
      label: content.key
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
      order: 1000,
    }
  );
}

function isPreviewableImageUrl(value: string) {
  return value.startsWith("https://") || value.startsWith("http://");
}

function ImageUploadForm({
  content,
  meta,
  section,
}: {
  content: EditableSiteContent;
  meta: FieldMeta;
  section: AdminSection;
}) {
  const [state, formAction, isPending] = useActionState(
    uploadSiteContentImageAction,
    initialUploadState,
  );
  const imageUrl = state.url ?? content.value;
  const canPreviewImage = isPreviewableImageUrl(imageUrl);
  const fieldId = `image-${content.id}`;

  return (
    <form
      action={formAction}
      className="space-y-3 rounded-md border border-primary/10 bg-white p-3"
      encType="multipart/form-data"
    >
      <input name="section" type="hidden" value={section.id} />
      <input name="contentId" type="hidden" value={content.id} />

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor={fieldId}>
          {meta.label}
        </label>

        <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-primary/10 bg-surface/50">
          {canPreviewImage ? (
            <Image
              alt={meta.label}
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 20rem, 100vw"
              src={imageUrl}
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm leading-6 text-muted">
              Nenhuma imagem cadastrada.
            </div>
          )}
        </div>
      </div>

      <input
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="block w-full cursor-pointer rounded-md border border-primary/10 bg-white text-sm text-muted file:mr-3 file:min-h-10 file:border-0 file:bg-primary file:px-3 file:text-sm file:font-medium file:text-background"
        id={fieldId}
        name="image"
        required
        type="file"
      />

      <p className="text-xs leading-5 text-muted">
        JPG, PNG, WebP ou AVIF ate 4 MB.
      </p>

      {state.error ? (
        <p className="rounded-md border border-accent/25 bg-accent/10 px-3 py-2 text-sm leading-6 text-foreground">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="rounded-md border border-primary/15 bg-surface/60 px-3 py-2 text-sm leading-6 text-primary">
          {state.success}
        </p>
      ) : null}

      <Button
        className="w-full"
        disabled={isPending}
        type="submit"
        variant="secondary"
      >
        <Upload aria-hidden="true" className="size-4" />
        {isPending ? "Enviando..." : "Substituir imagem"}
      </Button>
    </form>
  );
}

function ContentFieldsForm({
  contents,
  section,
}: {
  contents: EditableSiteContent[];
  section: AdminSection;
}) {
  const [state, formAction, isPending] = useActionState(
    saveSiteContentAction,
    initialSaveState,
  );

  if (!section.editable) {
    return (
      <div className="rounded-md border border-primary/10 bg-white p-4 text-sm leading-6 text-muted">
        Esta area ainda nao possui edicao de conteudo neste painel. Modelos,
        tecidos, uploads e usuarios serao tratados em etapas futuras.
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="rounded-md border border-primary/10 bg-white p-4 text-sm leading-6 text-muted">
        Nenhum conteudo cadastrado para esta secao. Rode o seed para popular os
        campos iniciais do site.
      </div>
    );
  }

  const textContents = contents.filter((content) =>
    textEditableTypes.has(content.type),
  );
  const imageContents = contents.filter((content) => content.type === "image");
  const unsupportedContents = contents.filter(
    (content) => !textEditableTypes.has(content.type) && content.type !== "image",
  );

  return (
    <div className="space-y-6">
      {textContents.length > 0 ? (
        <form action={formAction} className="space-y-5">
          <input name="section" type="hidden" value={section.id} />

          <div className="space-y-4">
            {textContents.map((content) => {
              const meta = getFieldMeta(content);
              const fieldId = `field-${content.id}`;

              return (
                <label
                  className="block space-y-2"
                  htmlFor={fieldId}
                  key={content.id}
                >
                  <span className="text-sm font-medium text-foreground">
                    {meta.label}
                  </span>
                  <input name="contentId" type="hidden" value={content.id} />

                  {content.type === "textarea" ? (
                    <textarea
                      className="min-h-28 w-full resize-none rounded-md border border-primary/10 bg-white px-3 py-3 text-sm leading-6 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                      defaultValue={content.value}
                      id={fieldId}
                      name={`value:${content.id}`}
                    />
                  ) : (
                    <input
                      className="min-h-11 w-full rounded-md border border-primary/10 bg-white px-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                      defaultValue={content.value}
                      id={fieldId}
                      name={`value:${content.id}`}
                      type="text"
                    />
                  )}
                </label>
              );
            })}
          </div>

          {state.error ? (
            <p className="rounded-md border border-accent/25 bg-accent/10 px-4 py-3 text-sm leading-6 text-foreground">
              {state.error}
            </p>
          ) : null}

          {state.success ? (
            <p className="rounded-md border border-primary/15 bg-white px-4 py-3 text-sm leading-6 text-primary">
              {state.success}
            </p>
          ) : null}

          <Button className="w-full" disabled={isPending} type="submit">
            <Save aria-hidden="true" className="size-4" />
            {isPending ? "Salvando..." : "Salvar textos"}
          </Button>
        </form>
      ) : null}

      {imageContents.length > 0 ? (
        <div className="space-y-4">
          {imageContents.map((content) => (
            <ImageUploadForm
              content={content}
              key={content.id}
              meta={getFieldMeta(content)}
              section={section}
            />
          ))}
        </div>
      ) : null}

      {unsupportedContents.length > 0 ? (
        <div className="space-y-3">
          {unsupportedContents.map((content) => (
            <div
              className="rounded-md border border-primary/10 bg-white p-3 text-sm leading-6 text-muted"
              key={content.id}
            >
              O campo {getFieldMeta(content).label} usa o tipo {content.type} e
              ainda nao pode ser editado.
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CatalogFeedback({ state }: { state: CatalogActionState }) {
  if (state.error) {
    return (
      <p className="rounded-md border border-accent/25 bg-accent/10 px-3 py-2 text-sm leading-6 text-foreground">
        {state.error}
      </p>
    );
  }

  if (state.success) {
    return (
      <p className="rounded-md border border-primary/15 bg-surface/60 px-3 py-2 text-sm leading-6 text-primary">
        {state.success}
      </p>
    );
  }

  return null;
}

function CatalogModelForm({ model }: { model?: EditableCatalogModel }) {
  const [state, formAction, isPending] = useActionState(
    saveCatalogModelAction,
    initialCatalogState,
  );
  const isEditing = Boolean(model);

  return (
    <form action={formAction} className="space-y-3">
      <input name="id" type="hidden" value={model?.id ?? ""} />

      <label className={labelClassName}>
        Nome
        <input
          className={inputClassName}
          defaultValue={model?.name}
          name="name"
          required
        />
      </label>

      <label className={labelClassName}>
        URL da imagem
        <input
          className={inputClassName}
          defaultValue={model?.imageUrl}
          name="imageUrl"
          required
        />
      </label>

      <label className={labelClassName}>
        Categoria
        <input
          className={inputClassName}
          defaultValue={model?.category}
          name="category"
          required
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className={labelClassName}>
          Tamanho
          <input
            className={inputClassName}
            defaultValue={model?.size}
            name="size"
            required
          />
        </label>
        <label className={labelClassName}>
          Tecido
          <input
            className={inputClassName}
            defaultValue={model?.fabric}
            name="fabric"
            required
          />
        </label>
        <label className={labelClassName}>
          Braco
          <input
            className={inputClassName}
            defaultValue={model?.armSize}
            name="armSize"
            required
          />
        </label>
        <label className={labelClassName}>
          Estrutura
          <input
            className={inputClassName}
            defaultValue={model?.structure}
            name="structure"
            required
          />
        </label>
      </div>

      <label className={labelClassName}>
        Mensagem do WhatsApp
        <textarea
          className={textareaClassName}
          defaultValue={model?.whatsappMessage}
          name="whatsappMessage"
          required
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-[1fr_7rem]">
        <label className="flex min-h-10 items-center gap-2 text-sm font-medium text-foreground">
          <input
            className="size-4 accent-primary"
            defaultChecked={model?.active ?? true}
            name="active"
            type="checkbox"
          />
          Ativo
        </label>
        <label className={labelClassName}>
          Ordem
          <input
            className={inputClassName}
            defaultValue={model?.sortOrder ?? 0}
            min={0}
            name="sortOrder"
            required
            type="number"
          />
        </label>
      </div>

      <CatalogFeedback state={state} />

      <Button className="w-full" disabled={isPending} type="submit">
        <Save aria-hidden="true" className="size-4" />
        {isPending
          ? "Salvando..."
          : isEditing
            ? "Salvar modelo"
            : "Criar modelo"}
      </Button>
    </form>
  );
}

function CatalogFabricForm({ fabric }: { fabric?: EditableCatalogFabric }) {
  const [state, formAction, isPending] = useActionState(
    saveCatalogFabricAction,
    initialCatalogState,
  );
  const isEditing = Boolean(fabric);

  return (
    <form action={formAction} className="space-y-3">
      <input name="id" type="hidden" value={fabric?.id ?? ""} />

      <label className={labelClassName}>
        Nome
        <input
          className={inputClassName}
          defaultValue={fabric?.name}
          name="name"
          required
        />
      </label>

      <label className={labelClassName}>
        URL da imagem
        <input
          className={inputClassName}
          defaultValue={fabric?.imageUrl}
          name="imageUrl"
          required
        />
      </label>

      <label className={labelClassName}>
        Descricao
        <textarea
          className={textareaClassName}
          defaultValue={fabric?.description}
          name="description"
          required
        />
      </label>

      <label className={labelClassName}>
        Tags
        <input
          className={inputClassName}
          defaultValue={fabric?.tags}
          name="tags"
          placeholder="pet-friendly,premium"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-[1fr_7rem]">
        <label className="flex min-h-10 items-center gap-2 text-sm font-medium text-foreground">
          <input
            className="size-4 accent-primary"
            defaultChecked={fabric?.active ?? true}
            name="active"
            type="checkbox"
          />
          Ativo
        </label>
        <label className={labelClassName}>
          Ordem
          <input
            className={inputClassName}
            defaultValue={fabric?.sortOrder ?? 0}
            min={0}
            name="sortOrder"
            required
            type="number"
          />
        </label>
      </div>

      <CatalogFeedback state={state} />

      <Button className="w-full" disabled={isPending} type="submit">
        <Save aria-hidden="true" className="size-4" />
        {isPending
          ? "Salvando..."
          : isEditing
            ? "Salvar tecido"
            : "Criar tecido"}
      </Button>
    </form>
  );
}

function CatalogActions({
  active,
  deleteAction,
  id,
  toggleAction,
}: {
  active: boolean;
  deleteAction: (formData: FormData) => void | Promise<void>;
  id: string;
  toggleAction: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <form action={toggleAction}>
        <input name="id" type="hidden" value={id} />
        <Button className="w-full" type="submit" variant="secondary">
          <Power aria-hidden="true" className="size-4" />
          {active ? "Desativar" : "Ativar"}
        </Button>
      </form>

      <form action={deleteAction}>
        <input name="id" type="hidden" value={id} />
        <Button className="w-full text-accent" type="submit" variant="secondary">
          <Trash2 aria-hidden="true" className="size-4" />
          Remover
        </Button>
      </form>
    </div>
  );
}

function CatalogModelManager({
  models,
}: {
  models: EditableCatalogModel[];
}) {
  return (
    <div className="space-y-4">
      <details className="rounded-md border border-primary/10 bg-white p-3">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-primary">
          <Plus aria-hidden="true" className="size-4" />
          Novo modelo
        </summary>
        <div className="mt-4">
          <CatalogModelForm />
        </div>
      </details>

      {models.length > 0 ? (
        models.map((model) => (
          <details
            className="rounded-md border border-primary/10 bg-white p-3"
            key={model.id}
          >
            <summary className="cursor-pointer list-none">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-primary">{model.name}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    Ordem {model.sortOrder} · {model.category}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-md border px-2 py-1 text-[0.62rem] font-medium uppercase tracking-[0.12em]",
                    model.active
                      ? "border-primary/15 text-primary"
                      : "border-accent/25 text-accent",
                  )}
                >
                  {model.active ? "Ativo" : "Inativo"}
                </span>
              </div>
            </summary>
            <div className="mt-4 space-y-4">
              <CatalogModelForm model={model} />
              <CatalogActions
                active={model.active}
                deleteAction={deleteCatalogModelAction}
                id={model.id}
                toggleAction={toggleCatalogModelAction}
              />
            </div>
          </details>
        ))
      ) : (
        <div className="rounded-md border border-primary/10 bg-white p-4 text-sm leading-6 text-muted">
          Nenhum modelo cadastrado.
        </div>
      )}
    </div>
  );
}

function CatalogFabricManager({
  fabrics,
}: {
  fabrics: EditableCatalogFabric[];
}) {
  return (
    <div className="space-y-4">
      <details className="rounded-md border border-primary/10 bg-white p-3">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-primary">
          <Plus aria-hidden="true" className="size-4" />
          Novo tecido
        </summary>
        <div className="mt-4">
          <CatalogFabricForm />
        </div>
      </details>

      {fabrics.length > 0 ? (
        fabrics.map((fabric) => (
          <details
            className="rounded-md border border-primary/10 bg-white p-3"
            key={fabric.id}
          >
            <summary className="cursor-pointer list-none">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-primary">{fabric.name}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    Ordem {fabric.sortOrder}
                    {fabric.tags ? ` · ${fabric.tags}` : ""}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-md border px-2 py-1 text-[0.62rem] font-medium uppercase tracking-[0.12em]",
                    fabric.active
                      ? "border-primary/15 text-primary"
                      : "border-accent/25 text-accent",
                  )}
                >
                  {fabric.active ? "Ativo" : "Inativo"}
                </span>
              </div>
            </summary>
            <div className="mt-4 space-y-4">
              <CatalogFabricForm fabric={fabric} />
              <CatalogActions
                active={fabric.active}
                deleteAction={deleteCatalogFabricAction}
                id={fabric.id}
                toggleAction={toggleCatalogFabricAction}
              />
            </div>
          </details>
        ))
      ) : (
        <div className="rounded-md border border-primary/10 bg-white p-4 text-sm leading-6 text-muted">
          Nenhum tecido cadastrado.
        </div>
      )}
    </div>
  );
}

export function AdminEditorLayout({
  catalogFabrics,
  catalogModels,
  contents,
  userEmail,
}: AdminEditorLayoutProps) {
  const [selectedSectionId, setSelectedSectionId] =
    useState<AdminSectionId>("inicio");

  const selectedSection = useMemo(
    () =>
      adminSections.find((section) => section.id === selectedSectionId) ??
      adminSections[0],
    [selectedSectionId],
  );

  const selectedContents = useMemo(
    () =>
      contents
        .filter((content) => content.section === selectedSection.id)
        .sort((current, next) => {
          const currentMeta = getFieldMeta(current);
          const nextMeta = getFieldMeta(next);

          return (
            currentMeta.order - nextMeta.order ||
            current.key.localeCompare(next.key)
          );
        }),
    [contents, selectedSection.id],
  );

  return (
    <main className="min-h-screen bg-white text-foreground">
      <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-[17rem_minmax(0,1fr)_22rem]">
        <aside className="border-b border-primary/10 bg-surface/25 lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col gap-5 p-4 sm:p-5">
            <div className="space-y-1">
              <div className="inline-flex size-10 items-center justify-center rounded-md bg-primary text-white">
                <LayoutDashboard aria-hidden="true" className="size-5" />
              </div>
              <p className="pt-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Admin
              </p>
              <h1 className="font-serif text-2xl text-primary">
                Editor visual
              </h1>
              <p className="text-xs leading-5 text-muted">
                {userEmail ? `Sessao ativa: ${userEmail}` : "Sessao ativa"}
              </p>
            </div>

            <nav
              aria-label="Secoes do painel"
              className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1"
            >
              {adminSections.map((section) => {
                const Icon = section.icon;
                const isSelected = section.id === selectedSection.id;

                return (
                  <button
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-md border px-3 py-2 text-left text-sm font-medium transition",
                      isSelected
                        ? "border-primary bg-white text-primary shadow-soft"
                        : "border-primary/10 bg-white/55 text-muted hover:border-accent/40 hover:text-primary",
                    )}
                    key={section.id}
                    onClick={() => setSelectedSectionId(section.id)}
                    type="button"
                  >
                    <Icon aria-hidden={true} className="size-4 shrink-0" />
                    <span className="truncate">{section.label}</span>
                  </button>
                );
              })}
            </nav>

            <form action={logoutAction} className="mt-auto">
              <Button className="w-full" type="submit" variant="secondary">
                <LogOut aria-hidden="true" className="size-4" />
                Sair
              </Button>
            </form>
          </div>
        </aside>

        <section className="flex min-h-[70vh] flex-col bg-white p-4 sm:p-5 lg:min-h-screen">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Preview
              </p>
              <h2 className="font-serif text-3xl text-primary">
                {selectedSection.label}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted">
              {selectedSection.description}
            </p>
          </div>

          <div className="min-h-[34rem] flex-1 overflow-hidden rounded-lg border border-primary/10 bg-surface/25 shadow-soft">
            <iframe
              className="h-full min-h-[34rem] w-full bg-white"
              key={selectedSection.previewPath}
              src={selectedSection.previewPath}
              title={`Preview da secao ${selectedSection.label}`}
            />
          </div>
        </section>

        <aside className="border-t border-primary/10 bg-surface/25 lg:border-l lg:border-t-0">
          <div className="p-4 sm:p-5">
            <div className="mb-5 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Campos
              </p>
              <h2 className="font-serif text-2xl text-primary">
                {selectedSection.label}
              </h2>
              <p className="text-sm leading-6 text-muted">
                {selectedSection.id === "modelos" ||
                selectedSection.id === "tecidos"
                  ? "Gerencie os dados exibidos no catalogo publico."
                  : "Edite textos e imagens salvos no banco para esta secao."}
              </p>
            </div>

            {selectedSection.id === "modelos" ? (
              <CatalogModelManager models={catalogModels} />
            ) : null}

            {selectedSection.id === "tecidos" ? (
              <CatalogFabricManager fabrics={catalogFabrics} />
            ) : null}

            {selectedSection.id !== "modelos" &&
            selectedSection.id !== "tecidos" ? (
              <ContentFieldsForm
                contents={selectedContents}
                key={selectedSection.id}
                section={selectedSection}
              />
            ) : null}
          </div>
        </aside>
      </div>
    </main>
  );
}
