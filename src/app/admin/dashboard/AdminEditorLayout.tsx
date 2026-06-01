"use client";

import Image from "next/image";
import {
  ChevronDown,
  Contact,
  Droplets,
  Gem,
  Home,
  Images,
  LayoutDashboard,
  LogOut,
  Monitor,
  MousePointerClick,
  Palette,
  PawPrint,
  Pencil,
  Plus,
  Power,
  Save,
  ScrollText,
  Smartphone,
  Sofa,
  Tablet,
  Trash2,
  Upload,
  UserPlus,
  Users,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
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
import { fabricTags } from "@/data/catalog";
import { cn } from "@/lib/utils";
import type { CatalogFabricTag } from "@/types";

type SiteSectionId =
  | "inicio"
  | "sobre"
  | "inspiracoes"
  | "orcamento"
  | "contato";
type CatalogSectionId = "modelos" | "tecidos";
type AdminViewId = "dashboard" | SiteSectionId | CatalogSectionId | "usuarios";
type PreviewMode = "desktop" | "tablet" | "mobile";

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

export type EditableUser = {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
};

type AdminSiteSection = {
  id: SiteSectionId;
  label: string;
  description: string;
  previewPath: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

type FieldMeta = {
  label: string;
  order: number;
};

type AdminEditorLayoutProps = {
  catalogFabrics: EditableCatalogFabric[];
  catalogModels: EditableCatalogModel[];
  contents: EditableSiteContent[];
  users: EditableUser[];
  userEmail?: string | null;
  whatsappClickCount: number;
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

const siteSections: AdminSiteSection[] = [
  {
    id: "inicio",
    label: "Inicio",
    description: "Destaque principal da pagina inicial.",
    previewPath: "/#inicio",
    icon: Home,
  },
  {
    id: "sobre",
    label: "Sobre",
    description: "Bloco institucional e diferenciais da marca.",
    previewPath: "/#sobre",
    icon: ScrollText,
  },
  {
    id: "inspiracoes",
    label: "Inspiracoes",
    description: "Galeria visual exibida na landing page.",
    previewPath: "/#inspiracoes",
    icon: Images,
  },
  {
    id: "orcamento",
    label: "Orcamento",
    description: "Textos de orientacao para solicitar orcamento.",
    previewPath: "/#orcamento",
    icon: ScrollText,
  },
  {
    id: "contato",
    label: "Contato",
    description: "Informacoes comerciais e canais de atendimento.",
    previewPath: "/#contato",
    icon: Contact,
  },
];

const previewModes: {
  id: PreviewMode;
  label: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  widthClassName: string;
}[] = [
  {
    id: "desktop",
    label: "Desktop",
    icon: Monitor,
    widthClassName: "w-full",
  },
  {
    id: "tablet",
    label: "Tablet",
    icon: Tablet,
    widthClassName: "w-full max-w-[820px]",
  },
  {
    id: "mobile",
    label: "Mobile",
    icon: Smartphone,
    widthClassName: "w-full max-w-[390px]",
  },
];

const fabricTagIcons = {
  "pet-friendly": PawPrint,
  impermeavel: Droplets,
  premium: Gem,
} satisfies Record<CatalogFabricTag, typeof PawPrint>;

const inputClassName =
  "min-h-10 w-full rounded-md border border-primary/10 bg-white px-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";
const textareaClassName =
  "min-h-24 w-full resize-none rounded-md border border-primary/10 bg-white px-3 py-3 text-sm leading-6 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";
const labelClassName = "block space-y-1.5 text-sm font-medium text-foreground";
const initialSaveState: SaveSiteContentState = {};
const initialUploadState: UploadSiteContentImageState = {};
const initialCatalogState: CatalogActionState = {};

function isSiteSectionId(viewId: AdminViewId): viewId is SiteSectionId {
  return siteSections.some((section) => section.id === viewId);
}

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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function contentToFabricTags(tags: string) {
  const allowedTags = new Set(fabricTags.map((tag) => tag.id));

  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag): tag is CatalogFabricTag =>
      allowedTags.has(tag as CatalogFabricTag),
    );
}

function SidebarButton({
  icon: Icon,
  isSelected,
  label,
  onClick,
}: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  isSelected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-current={isSelected ? "page" : undefined}
      className={cn(
        "flex min-h-10 w-full items-center gap-3 rounded-md border px-3 py-2 text-left text-sm font-medium transition",
        isSelected
          ? "border-primary bg-white text-primary shadow-soft"
          : "border-primary/10 bg-white/55 text-muted hover:border-accent/40 hover:text-primary",
      )}
      onClick={onClick}
      type="button"
    >
      <Icon aria-hidden={true} className="size-4 shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
}

function SidebarGroup({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <details className="group" open>
      <summary className="mb-2 flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-primary/65">
        {label}
        <ChevronDown
          aria-hidden="true"
          className="size-4 transition group-open:rotate-180"
        />
      </summary>
      <div className="grid gap-2">{children}</div>
    </details>
  );
}

function ImageUploadForm({
  content,
  meta,
  section,
}: {
  content: EditableSiteContent;
  meta: FieldMeta;
  section: AdminSiteSection;
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
  section: AdminSiteSection;
}) {
  const [state, formAction, isPending] = useActionState(
    saveSiteContentAction,
    initialSaveState,
  );

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
        <span className="block text-xs font-normal leading-5 text-muted">
          Upload direto de imagem sera adicionado em etapa futura.
        </span>
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
        <span className="block text-xs font-normal leading-5 text-muted">
          Upload direto de imagem sera adicionado em etapa futura.
        </span>
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

function DashboardHome({
  catalogFabricsCount,
  catalogModelsCount,
  onNavigate,
  userEmail,
  usersCount,
  whatsappClickCount,
}: {
  catalogFabricsCount: number;
  catalogModelsCount: number;
  onNavigate: (viewId: AdminViewId) => void;
  userEmail?: string | null;
  usersCount: number;
  whatsappClickCount: number;
}) {
  const summaryCards = [
    {
      label: "Usuarios cadastrados",
      value: usersCount,
      icon: Users,
    },
    {
      label: "Cliques no WhatsApp",
      value: whatsappClickCount,
      icon: MousePointerClick,
    },
    {
      label: "Itens no catalogo",
      value: catalogModelsCount + catalogFabricsCount,
      icon: Sofa,
    },
  ];

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-primary/10 bg-surface/25 p-5 shadow-soft sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Dashboard
        </p>
        <h2 className="mt-3 font-serif text-3xl text-primary">
          Bem-vindo ao admin
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          {userEmail
            ? `Sessao ativa para ${userEmail}.`
            : "Sessao administrativa ativa."}{" "}
          Use os atalhos para editar o site, revisar o catalogo e preparar a
          gestao de usuarios.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              className="rounded-lg border border-primary/10 bg-white p-5 shadow-soft"
              key={card.label}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  {card.label}
                </p>
                <Icon aria-hidden="true" className="size-5 text-accent" />
              </div>
              <p className="mt-4 font-serif text-4xl text-primary">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Button
          className="justify-start"
          onClick={() => onNavigate("inicio")}
          type="button"
          variant="secondary"
        >
          <Home aria-hidden="true" className="size-4" />
          Editar site
        </Button>
        <Button
          className="justify-start"
          onClick={() => onNavigate("modelos")}
          type="button"
          variant="secondary"
        >
          <Sofa aria-hidden="true" className="size-4" />
          Ver catalogo
        </Button>
        <Button
          className="justify-start"
          onClick={() => onNavigate("usuarios")}
          type="button"
          variant="secondary"
        >
          <Users aria-hidden="true" className="size-4" />
          Usuarios
        </Button>
      </div>
    </section>
  );
}

function DashboardSidePanel({
  catalogFabricsCount,
  catalogModelsCount,
  usersCount,
  whatsappClickCount,
}: {
  catalogFabricsCount: number;
  catalogModelsCount: number;
  usersCount: number;
  whatsappClickCount: number;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-md border border-primary/10 bg-white p-4">
        <p className="text-sm font-semibold text-primary">Resumo rapido</p>
        <dl className="mt-3 space-y-2 text-sm leading-6 text-muted">
          <div className="flex justify-between gap-3">
            <dt>Modelos</dt>
            <dd className="font-medium text-primary">{catalogModelsCount}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Tecidos</dt>
            <dd className="font-medium text-primary">{catalogFabricsCount}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Usuarios</dt>
            <dd className="font-medium text-primary">{usersCount}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>WhatsApp</dt>
            <dd className="font-medium text-primary">{whatsappClickCount}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-md border border-primary/10 bg-white p-4 text-sm leading-6 text-muted">
        A rota interna de metricas ja esta preparada para registrar cliques de
        WhatsApp quando os botoes publicos forem conectados.
      </div>
    </div>
  );
}

function SitePreview({
  previewMode,
  section,
  setPreviewMode,
}: {
  previewMode: PreviewMode;
  section: AdminSiteSection;
  setPreviewMode: (mode: PreviewMode) => void;
}) {
  const activeMode = previewModes.find((mode) => mode.id === previewMode);

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Preview responsivo
          </p>
          <h2 className="font-serif text-3xl text-primary">{section.label}</h2>
        </div>

        <div className="inline-flex w-fit rounded-md border border-primary/10 bg-white p-1 shadow-soft">
          {previewModes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = mode.id === previewMode;

            return (
              <button
                aria-pressed={isSelected}
                className={cn(
                  "inline-flex size-10 items-center justify-center rounded-md text-primary/60 transition hover:bg-surface hover:text-primary",
                  isSelected && "bg-primary text-background hover:bg-primary",
                )}
                key={mode.id}
                onClick={() => setPreviewMode(mode.id)}
                title={mode.label}
                type="button"
              >
                <Icon aria-hidden={true} className="size-4" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex min-h-[34rem] flex-1 justify-center overflow-auto rounded-lg border border-primary/10 bg-surface/25 p-3 shadow-soft">
        <div
          className={cn(
            "min-h-[34rem] overflow-hidden rounded-md bg-white shadow-soft transition-all",
            activeMode?.widthClassName,
          )}
        >
          <iframe
            className="h-full min-h-[34rem] w-full bg-white"
            key={`${section.previewPath}-${previewMode}`}
            src={section.previewPath}
            title={`Preview da secao ${section.label}`}
          />
        </div>
      </div>
    </section>
  );
}

function CatalogModelPreviewCard({
  isSelected,
  model,
  onSelect,
}: {
  isSelected: boolean;
  model: EditableCatalogModel;
  onSelect: () => void;
}) {
  const modelDetails = [
    ["size", "Tamanho"],
    ["fabric", "Tecido"],
    ["armSize", "Braco"],
    ["structure", "Estrutura"],
  ] as const;

  return (
    <article
      aria-pressed={isSelected}
      className={cn(
        "cursor-pointer overflow-hidden rounded-lg border bg-background text-left shadow-soft transition md:grid md:grid-cols-[3fr_2fr]",
        isSelected
          ? "border-primary ring-2 ring-primary/10"
          : "border-primary/10 hover:border-accent/40",
      )}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[220px]">
        <Image
          alt={model.name}
          className="object-cover"
          fill
          sizes="(min-width: 1024px) 28vw, (min-width: 768px) 54vw, 100vw"
          src={model.imageUrl}
        />
      </div>

      <div className="flex flex-col justify-center p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.2em] text-accent">
            {model.category}
          </p>
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
        <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight text-primary">
          {model.name}
        </h2>

        <dl className="mt-4 grid gap-2 sm:grid-cols-2">
          {modelDetails.map(([key, label]) => (
            <div className="border-t border-primary/10 pt-2" key={key}>
              <dt className="text-[0.64rem] font-medium uppercase tracking-[0.14em] text-muted">
                {label}
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-primary">
                {model[key]}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

function CatalogFabricPreviewCard({
  fabric,
  isSelected,
  onSelect,
}: {
  fabric: EditableCatalogFabric;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const tags = contentToFabricTags(fabric.tags);

  return (
    <article
      aria-pressed={isSelected}
      className={cn(
        "cursor-pointer overflow-hidden rounded-lg border bg-background text-left shadow-soft transition",
        isSelected
          ? "border-primary ring-2 ring-primary/10"
          : "border-primary/10 hover:border-accent/40",
      )}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          alt={fabric.name}
          className="object-cover"
          fill
          sizes="(min-width: 1280px) 28vw, (min-width: 768px) 45vw, 100vw"
          src={fabric.imageUrl}
        />
        <div className="absolute bottom-3 right-3 flex flex-wrap justify-end gap-1.5">
          {tags.map((tagId) => {
            const tag = fabricTags.find((fabricTag) => fabricTag.id === tagId);

            if (!tag) {
              return null;
            }

            const Icon = fabricTagIcons[tag.id];

            return (
              <span
                className="inline-flex items-center gap-1 rounded-md border border-primary/10 bg-background/90 px-2 py-1 text-[0.62rem] font-medium uppercase tracking-[0.1em] text-primary shadow-soft"
                key={tag.id}
              >
                <Icon aria-hidden="true" className="size-3" />
                {tag.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-serif text-2xl font-semibold leading-tight text-primary">
            {fabric.name}
          </h2>
          <span
            className={cn(
              "shrink-0 rounded-md border px-2 py-1 text-[0.62rem] font-medium uppercase tracking-[0.12em]",
              fabric.active
                ? "border-primary/15 text-primary"
                : "border-accent/25 text-accent",
            )}
          >
            {fabric.active ? "Ativo" : "Inativo"}
          </span>
        </div>
        <p className="text-sm leading-7 text-muted">{fabric.description}</p>
      </div>
    </article>
  );
}

function CatalogModelsWorkspace({
  models,
  onSelect,
  selectedModelId,
}: {
  models: EditableCatalogModel[];
  onSelect: (id: string) => void;
  selectedModelId: string | null;
}) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Catalogo
        </p>
        <h2 className="font-serif text-3xl text-primary">Modelos</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Selecione um card para editar os dados no painel lateral. Esta area
          nao carrega o site publico em iframe.
        </p>
      </div>

      {models.length > 0 ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {models.map((model) => (
            <CatalogModelPreviewCard
              isSelected={model.id === selectedModelId}
              key={model.id}
              model={model}
              onSelect={() => onSelect(model.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-primary/10 bg-white p-6 text-sm leading-7 text-muted shadow-soft">
          Nenhum modelo cadastrado.
        </div>
      )}
    </section>
  );
}

function CatalogFabricsWorkspace({
  fabrics,
  onSelect,
  selectedFabricId,
}: {
  fabrics: EditableCatalogFabric[];
  onSelect: (id: string) => void;
  selectedFabricId: string | null;
}) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Catalogo
        </p>
        <h2 className="font-serif text-3xl text-primary">Tecidos</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Os cards seguem a estrutura visual atual do catalogo e podem ser
          selecionados para edicao no painel lateral.
        </p>
      </div>

      {fabrics.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {fabrics.map((fabric) => (
            <CatalogFabricPreviewCard
              fabric={fabric}
              isSelected={fabric.id === selectedFabricId}
              key={fabric.id}
              onSelect={() => onSelect(fabric.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-primary/10 bg-white p-6 text-sm leading-7 text-muted shadow-soft">
          Nenhum tecido cadastrado.
        </div>
      )}
    </section>
  );
}

function CatalogModelManager({
  selectedModel,
}: {
  selectedModel: EditableCatalogModel | null;
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

      {selectedModel ? (
        <div className="space-y-4 rounded-md border border-primary/10 bg-white p-3">
          <div>
            <p className="text-sm font-semibold text-primary">
              Editando {selectedModel.name}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted">
              Ordem {selectedModel.sortOrder} · {selectedModel.category}
            </p>
          </div>
          <CatalogModelForm key={selectedModel.id} model={selectedModel} />
          <CatalogActions
            active={selectedModel.active}
            deleteAction={deleteCatalogModelAction}
            id={selectedModel.id}
            toggleAction={toggleCatalogModelAction}
          />
        </div>
      ) : (
        <div className="rounded-md border border-primary/10 bg-white p-4 text-sm leading-6 text-muted">
          Selecione um modelo na listagem central para editar os campos.
        </div>
      )}
    </div>
  );
}

function CatalogFabricManager({
  selectedFabric,
}: {
  selectedFabric: EditableCatalogFabric | null;
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

      {selectedFabric ? (
        <div className="space-y-4 rounded-md border border-primary/10 bg-white p-3">
          <div>
            <p className="text-sm font-semibold text-primary">
              Editando {selectedFabric.name}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted">
              Ordem {selectedFabric.sortOrder}
              {selectedFabric.tags ? ` · ${selectedFabric.tags}` : ""}
            </p>
          </div>
          <CatalogFabricForm key={selectedFabric.id} fabric={selectedFabric} />
          <CatalogActions
            active={selectedFabric.active}
            deleteAction={deleteCatalogFabricAction}
            id={selectedFabric.id}
            toggleAction={toggleCatalogFabricAction}
          />
        </div>
      ) : (
        <div className="rounded-md border border-primary/10 bg-white p-4 text-sm leading-6 text-muted">
          Selecione um tecido na listagem central para editar os campos.
        </div>
      )}
    </div>
  );
}

function UsersWorkspace({ users }: { users: EditableUser[] }) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Acessos
        </p>
        <h2 className="font-serif text-3xl text-primary">Usuarios</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Listagem inicial dos acessos administrativos. As acoes de cadastro,
          edicao e ativacao ficam preparadas visualmente para a proxima etapa.
        </p>
      </div>

      {users.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-primary/10 bg-white shadow-soft">
          <div className="grid gap-0 divide-y divide-primary/10">
            {users.map((user) => (
              <div
                className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
                key={user.id}
              >
                <div>
                  <p className="font-medium text-primary">
                    {user.name || "Usuario sem nome"}
                  </p>
                  <p className="mt-1 text-sm text-muted">{user.email}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-primary/15 px-2 py-1 text-[0.62rem] font-medium uppercase tracking-[0.12em] text-primary">
                    Ativo
                  </span>
                  <span className="text-xs text-muted">
                    Criado em {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-primary/10 bg-white p-6 text-sm leading-7 text-muted shadow-soft">
          Nenhum usuario cadastrado.
        </div>
      )}
    </section>
  );
}

function UsersSidePanel() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-primary/10 bg-white p-3">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-primary">
          <UserPlus aria-hidden="true" className="size-4" />
          Novo usuario
        </div>
        <div className="space-y-3">
          <label className={labelClassName}>
            Nome
            <input className={inputClassName} disabled placeholder="Em breve" />
          </label>
          <label className={labelClassName}>
            E-mail
            <input className={inputClassName} disabled placeholder="Em breve" />
          </label>
          <Button className="w-full" disabled type="button">
            Cadastrar usuario
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-primary/10 bg-white p-3">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
          <Pencil aria-hidden="true" className="size-4" />
          Acoes preparadas
        </div>
        <div className="grid gap-2">
          <Button className="w-full" disabled type="button" variant="secondary">
            Editar usuario
          </Button>
          <Button className="w-full" disabled type="button" variant="secondary">
            Ativar/desativar
          </Button>
        </div>
        <p className="mt-3 text-xs leading-5 text-muted">
          O model atual de usuario nao possui status ativo. A regra de acesso
          sera definida antes de habilitar essas acoes.
        </p>
      </div>
    </div>
  );
}

export function AdminEditorLayout({
  catalogFabrics,
  catalogModels,
  contents,
  userEmail,
  users,
  whatsappClickCount,
}: AdminEditorLayoutProps) {
  const [selectedViewId, setSelectedViewId] =
    useState<AdminViewId>("dashboard");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [selectedFabricId, setSelectedFabricId] = useState<string | null>(null);

  const selectedSiteSection = useMemo(
    () =>
      isSiteSectionId(selectedViewId)
        ? siteSections.find((section) => section.id === selectedViewId) ?? null
        : null,
    [selectedViewId],
  );

  const selectedContents = useMemo(
    () =>
      selectedSiteSection
        ? contents
            .filter((content) => content.section === selectedSiteSection.id)
            .sort((current, next) => {
              const currentMeta = getFieldMeta(current);
              const nextMeta = getFieldMeta(next);

              return (
                currentMeta.order - nextMeta.order ||
                current.key.localeCompare(next.key)
              );
            })
        : [],
    [contents, selectedSiteSection],
  );

  const selectedModel =
    catalogModels.find((model) => model.id === selectedModelId) ?? null;
  const selectedFabric =
    catalogFabrics.find((fabric) => fabric.id === selectedFabricId) ?? null;

  const rightPanelTitle = selectedSiteSection
    ? selectedSiteSection.label
    : selectedViewId === "modelos"
      ? "Modelos"
      : selectedViewId === "tecidos"
        ? "Tecidos"
        : selectedViewId === "usuarios"
          ? "Usuarios"
          : "Resumo";

  return (
    <main className="min-h-dvh bg-white text-foreground lg:h-dvh lg:overflow-hidden">
      <div className="flex min-h-dvh flex-col lg:grid lg:h-full lg:min-h-0 lg:grid-cols-[17rem_minmax(0,1fr)_22rem] lg:overflow-clip">
        <aside className="min-h-0 border-b border-primary/10 bg-surface/25 lg:h-full lg:overflow-clip lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col gap-5 p-4 sm:p-5">
            <div className="space-y-1">
              <div className="inline-flex size-10 items-center justify-center rounded-md bg-primary text-white">
                <LayoutDashboard aria-hidden="true" className="size-5" />
              </div>
              <p className="pt-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Admin
              </p>
              <h1 className="font-serif text-2xl text-primary">
                Painel administrativo
              </h1>
              <p className="text-xs leading-5 text-muted">
                {userEmail ? `Sessao ativa: ${userEmail}` : "Sessao ativa"}
              </p>
            </div>

            <nav aria-label="Navegacao do painel" className="space-y-5">
              <SidebarButton
                icon={LayoutDashboard}
                isSelected={selectedViewId === "dashboard"}
                label="Dashboard"
                onClick={() => setSelectedViewId("dashboard")}
              />

              <SidebarGroup label="Site">
                {siteSections.map((section) => (
                  <SidebarButton
                    icon={section.icon}
                    isSelected={selectedViewId === section.id}
                    key={section.id}
                    label={section.label}
                    onClick={() => setSelectedViewId(section.id)}
                  />
                ))}
              </SidebarGroup>

              <SidebarGroup label="Catalogo">
                <SidebarButton
                  icon={Sofa}
                  isSelected={selectedViewId === "modelos"}
                  label="Modelos"
                  onClick={() => setSelectedViewId("modelos")}
                />
                <SidebarButton
                  icon={Palette}
                  isSelected={selectedViewId === "tecidos"}
                  label="Tecidos"
                  onClick={() => setSelectedViewId("tecidos")}
                />
              </SidebarGroup>

              <SidebarButton
                icon={Users}
                isSelected={selectedViewId === "usuarios"}
                label="Usuarios"
                onClick={() => setSelectedViewId("usuarios")}
              />
            </nav>

            <form action={logoutAction} className="mt-auto">
              <Button className="w-full" type="submit" variant="secondary">
                <LogOut aria-hidden="true" className="size-4" />
                Sair
              </Button>
            </form>
          </div>
        </aside>

        <section className="min-h-0 bg-white p-4 sm:p-5 lg:h-full lg:overflow-y-auto">
          {selectedViewId === "dashboard" ? (
            <DashboardHome
              catalogFabricsCount={catalogFabrics.length}
              catalogModelsCount={catalogModels.length}
              onNavigate={setSelectedViewId}
              userEmail={userEmail}
              usersCount={users.length}
              whatsappClickCount={whatsappClickCount}
            />
          ) : null}

          {selectedSiteSection ? (
            <SitePreview
              previewMode={previewMode}
              section={selectedSiteSection}
              setPreviewMode={setPreviewMode}
            />
          ) : null}

          {selectedViewId === "modelos" ? (
            <CatalogModelsWorkspace
              models={catalogModels}
              onSelect={setSelectedModelId}
              selectedModelId={selectedModelId}
            />
          ) : null}

          {selectedViewId === "tecidos" ? (
            <CatalogFabricsWorkspace
              fabrics={catalogFabrics}
              onSelect={setSelectedFabricId}
              selectedFabricId={selectedFabricId}
            />
          ) : null}

          {selectedViewId === "usuarios" ? (
            <UsersWorkspace users={users} />
          ) : null}
        </section>

        <aside className="min-h-0 border-t border-primary/10 bg-surface/25 lg:h-full lg:overflow-y-auto lg:border-l lg:border-t-0">
          <div className="p-4 sm:p-5">
            <div className="mb-5 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Painel lateral
              </p>
              <h2 className="font-serif text-2xl text-primary">
                {rightPanelTitle}
              </h2>
              <p className="text-sm leading-6 text-muted">
                {selectedSiteSection
                  ? "Edite textos e imagens salvos no banco para esta secao."
                  : selectedViewId === "modelos" ||
                      selectedViewId === "tecidos"
                    ? "Edite o item selecionado ou crie um novo registro."
                    : selectedViewId === "usuarios"
                      ? "Base visual para gestao futura de acessos."
                      : "Resumo e preparacao das proximas metricas."}
              </p>
            </div>

            {selectedViewId === "dashboard" ? (
              <DashboardSidePanel
                catalogFabricsCount={catalogFabrics.length}
                catalogModelsCount={catalogModels.length}
                usersCount={users.length}
                whatsappClickCount={whatsappClickCount}
              />
            ) : null}

            {selectedSiteSection ? (
              <ContentFieldsForm
                contents={selectedContents}
                key={selectedSiteSection.id}
                section={selectedSiteSection}
              />
            ) : null}

            {selectedViewId === "modelos" ? (
              <CatalogModelManager selectedModel={selectedModel} />
            ) : null}

            {selectedViewId === "tecidos" ? (
              <CatalogFabricManager selectedFabric={selectedFabric} />
            ) : null}

            {selectedViewId === "usuarios" ? <UsersSidePanel /> : null}
          </div>
        </aside>
      </div>
    </main>
  );
}
