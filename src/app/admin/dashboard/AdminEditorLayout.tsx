"use client";

import Image from "next/image";
import {
  AlertTriangle,
  ChevronDown,
  Contact,
  Droplets,
  Feather,
  Flame,
  Gem,
  Home,
  Images,
  LayoutDashboard,
  Leaf,
  LogOut,
  Monitor,
  MousePointerClick,
  Palette,
  PawPrint,
  Plus,
  Power,
  Save,
  ScrollText,
  ShieldCheck,
  Smartphone,
  Snowflake,
  Sofa,
  Sparkles,
  Sun,
  Tablet,
  Trash2,
  Upload,
  Waves,
  X,
} from "lucide-react";
import type { ChangeEvent, ComponentType, ReactNode } from "react";
import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  createCatalogFabricTagAction,
  deleteCatalogFabricTagAction,
} from "../actions";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { CatalogFabricTag, CatalogFabricTagItem } from "@/types";

type SiteSectionId =
  | "inicio"
  | "sobre"
  | "inspiracoes"
  | "orcamento"
  | "contato";
type CatalogSectionId = "modelos" | "tecidos";
type AdminViewId = "dashboard" | SiteSectionId | CatalogSectionId;
type PreviewMode = "desktop" | "tablet" | "mobile";
type ContentPanelTab = "textos" | "imagens";
type CatalogEditMode = "new" | `edit:${string}` | null;
type FabricPanelTab = "tecido" | "tags";
type SiteContentValues = Record<string, string>;
type ConfirmationTone = "primary" | "danger";

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

export type EditableCatalogFabricTag = CatalogFabricTagItem & {
  sortOrder: number;
};

type AdminSiteSection = {
  id: SiteSectionId;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

type FieldMeta = {
  label: string;
  order: number;
};

type ConfirmationModalProps = {
  cancelLabel?: string;
  confirmLabel: string;
  description: string;
  formAction?: (formData: FormData) => void | Promise<void>;
  hiddenFields?: Record<string, string>;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  tone?: ConfirmationTone;
};

type AdminEditorLayoutProps = {
  catalogFabrics: EditableCatalogFabric[];
  catalogFabricTags: EditableCatalogFabricTag[];
  catalogModels: EditableCatalogModel[];
  contents: EditableSiteContent[];
  userEmail?: string | null;
  whatsappClickCount: number;
};

const textEditableTypes = new Set(["text", "textarea"]);

const fieldMetadata: Record<string, FieldMeta> = {
  "inicio.eyebrow": { label: "Chamada superior", order: 10 },
  "inicio.hero_title": { label: "Título principal", order: 20 },
  "inicio.hero_image": { label: "Imagem principal", order: 30 },
  "inicio.hero_footer": { label: "Texto inferior", order: 40 },
  "sobre.eyebrow": { label: "Chamada superior", order: 10 },
  "sobre.title": { label: "Título", order: 20 },
  "sobre.image": { label: "Imagem institucional", order: 30 },
  "sobre.description": { label: "Descrição", order: 40 },
  "sobre.stat_1_title": { label: "Destaque 1", order: 50 },
  "sobre.stat_1_label": { label: "Rótulo do destaque 1", order: 60 },
  "sobre.stat_2_title": { label: "Destaque 2", order: 70 },
  "sobre.stat_2_label": { label: "Rótulo do destaque 2", order: 80 },
  "sobre.stat_3_title": { label: "Destaque 3", order: 90 },
  "sobre.stat_3_label": { label: "Rótulo do destaque 3", order: 100 },
  "inspiracoes.eyebrow": { label: "Chamada superior", order: 10 },
  "inspiracoes.title": { label: "Título", order: 20 },
  "inspiracoes.description": { label: "Descrição", order: 30 },
  "inspiracoes.catalog_text": { label: "Texto do catálogo", order: 40 },
  "inspiracoes.gallery_1_image": { label: "Imagem da galeria 1", order: 50 },
  "inspiracoes.gallery_2_image": { label: "Imagem da galeria 2", order: 60 },
  "inspiracoes.gallery_3_image": { label: "Imagem da galeria 3", order: 70 },
  "inspiracoes.gallery_4_image": { label: "Imagem da galeria 4", order: 80 },
  "orcamento.eyebrow": { label: "Chamada superior", order: 10 },
  "orcamento.title": { label: "Título", order: 20 },
  "orcamento.description": { label: "Descrição", order: 30 },
  "contato.eyebrow": { label: "Chamada superior", order: 10 },
  "contato.title": { label: "Título", order: 20 },
  "contato.description": { label: "Descrição", order: 30 },
  "contato.primary_cta": { label: "Botão principal", order: 40 },
  "contato.secondary_cta": { label: "Botão secundário", order: 50 },
  "contato.address_title": { label: "Título do endereço", order: 60 },
  "contato.hours_title": { label: "Título do horário", order: 70 },
  "contato.social_title": { label: "Título das redes sociais", order: 80 },
};

const siteSections: AdminSiteSection[] = [
  {
    id: "inicio",
    label: "Início",
    description: "Destaque principal da página inicial.",
    icon: Home,
  },
  {
    id: "sobre",
    label: "Sobre",
    description: "Bloco institucional e diferenciais da marca.",
    icon: ScrollText,
  },
  {
    id: "inspiracoes",
    label: "Inspirações",
    description: "Galeria visual exibida na landing page.",
    icon: Images,
  },
  {
    id: "orcamento",
    label: "Orçamento",
    description: "Textos de orientação para solicitar orçamento.",
    icon: ScrollText,
  },
  {
    id: "contato",
    label: "Contato",
    description: "Informações comerciais e canais de atendimento.",
    icon: Contact,
  },
];

const previewModes: {
  height: number;
  id: PreviewMode;
  label: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  width: number;
}[] = [
  {
    height: 920,
    id: "desktop",
    label: "Desktop",
    icon: Monitor,
    width: 1280,
  },
  {
    height: 1180,
    id: "tablet",
    label: "Tablet",
    icon: Tablet,
    width: 820,
  },
  {
    height: 844,
    id: "mobile",
    label: "Mobile",
    icon: Smartphone,
    width: 390,
  },
];

const fabricTagIconOptions = [
  { id: "paw-print", label: "Pet", icon: PawPrint },
  { id: "droplets", label: "Impermeável", icon: Droplets },
  { id: "gem", label: "Premium", icon: Gem },
  { id: "shield-check", label: "Proteção", icon: ShieldCheck },
  { id: "sparkles", label: "Brilho", icon: Sparkles },
  { id: "sofa", label: "Sofá", icon: Sofa },
  { id: "feather", label: "Leve", icon: Feather },
  { id: "leaf", label: "Natural", icon: Leaf },
  { id: "waves", label: "Ondas", icon: Waves },
  { id: "sun", label: "Sol", icon: Sun },
  { id: "snowflake", label: "Frio", icon: Snowflake },
  { id: "flame", label: "Chama", icon: Flame },
] as const;
const fabricTagIcons = Object.fromEntries(
  fabricTagIconOptions.map((option) => [option.id, option.icon])
);

const inputClassName =
  "min-h-10 w-full rounded-md border border-primary/10 bg-white px-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";
const textareaClassName =
  "min-h-24 w-full resize-none rounded-md border border-primary/10 bg-white px-3 py-3 text-sm leading-6 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";
const labelClassName = "block space-y-1.5 text-sm font-medium text-foreground";
const initialSaveState: SaveSiteContentState = {};
const initialUploadState: UploadSiteContentImageState = {};
const initialCatalogState: CatalogActionState = {};
const previewMessageType = "admin-site-preview:update";

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

function getContentValueKey(content: EditableSiteContent) {
  return `${content.section}.${content.key}`;
}

function contentsToValues(contents: EditableSiteContent[]) {
  return Object.fromEntries(
    contents.map((content) => [getContentValueKey(content), content.value])
  );
}

function isPreviewableImageUrl(value: string) {
  return (
    value.startsWith("https://") ||
    value.startsWith("http://") ||
    value.startsWith("data:image/")
  );
}

function getFabricTagIcon(icon: string) {
  return fabricTagIcons[icon as keyof typeof fabricTagIcons] ?? Gem;
}

function contentToFabricTags(
  tags: string,
  availableTags: Pick<EditableCatalogFabricTag, "id">[]
) {
  const allowedTags = new Set(availableTags.map((tag) => tag.id));

  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag): tag is CatalogFabricTag =>
      allowedTags.has(tag as CatalogFabricTag)
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
          : "border-primary/10 bg-white/55 text-muted hover:border-accent/40 hover:text-primary"
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
  draftValue,
  meta,
  onDraftChange,
  section,
}: {
  content: EditableSiteContent;
  draftValue?: string;
  meta: FieldMeta;
  onDraftChange: (content: EditableSiteContent, value: string) => void;
  section: AdminSiteSection;
}) {
  const [state, formAction, isPending] = useActionState(
    uploadSiteContentImageAction,
    initialUploadState
  );
  const imageUrl = draftValue ?? state.url ?? content.value;
  const canPreviewImage = isPreviewableImageUrl(imageUrl);
  const fieldId = `image-${content.id}`;

  useEffect(() => {
    if (state.url) {
      onDraftChange(content, state.url);
    }
  }, [content, onDraftChange, state.url]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        onDraftChange(content, reader.result);
      }
    });
    reader.readAsDataURL(file);
  }

  return (
    <form
      action={formAction}
      className="space-y-3 rounded-md border border-primary/10 bg-white p-3"
    >
      <input name="section" type="hidden" value={section.id} />
      <input name="contentId" type="hidden" value={content.id} />

      <div className="space-y-2">
        <label
          className="text-sm font-medium text-foreground"
          htmlFor={fieldId}
        >
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
        onChange={handleImageChange}
        required
        type="file"
      />

      <p className="text-xs leading-5 text-muted">
        JPG, PNG, WebP ou AVIF até 4 MB.
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
  draftValues = {},
  onDraftChange = () => {},
  section,
}: {
  contents: EditableSiteContent[];
  draftValues?: SiteContentValues;
  onDraftChange?: (content: EditableSiteContent, value: string) => void;
  section: AdminSiteSection;
}) {
  const [state, formAction, isPending] = useActionState(
    saveSiteContentAction,
    initialSaveState
  );
  const [activeTab, setActiveTab] = useState<ContentPanelTab>("textos");

  if (contents.length === 0) {
    return (
      <div className="rounded-md border border-primary/10 bg-white p-4 text-sm leading-6 text-muted">
        Nenhum conteúdo cadastrado para esta seção. Rode o seed para popular os
        campos iniciais do site.
      </div>
    );
  }

  const textContents = contents.filter((content) =>
    textEditableTypes.has(content.type)
  );
  const imageContents = contents.filter((content) => content.type === "image");
  const unsupportedContents = contents.filter(
    (content) =>
      !textEditableTypes.has(content.type) && content.type !== "image"
  );
  const hasImageTab = imageContents.length > 0;
  const visibleTab = hasImageTab ? activeTab : "textos";

  return (
    <div className="space-y-6">
      {hasImageTab ? (
        <div
          aria-label="Tipo de conteúdo"
          className="grid grid-cols-2 rounded-md border border-primary/10 bg-white p-1 shadow-soft"
          role="tablist"
        >
          <button
            aria-selected={visibleTab === "textos"}
            className={cn(
              "flex min-h-10 items-center justify-center gap-2 rounded px-3 text-sm font-medium transition",
              visibleTab === "textos"
                ? "bg-primary text-white"
                : "text-muted hover:text-primary"
            )}
            onClick={() => setActiveTab("textos")}
            role="tab"
            type="button"
          >
            <ScrollText aria-hidden="true" className="size-4" />
            Textos
          </button>
          <button
            aria-selected={visibleTab === "imagens"}
            className={cn(
              "flex min-h-10 items-center justify-center gap-2 rounded px-3 text-sm font-medium transition",
              visibleTab === "imagens"
                ? "bg-primary text-white"
                : "text-muted hover:text-primary"
            )}
            onClick={() => setActiveTab("imagens")}
            role="tab"
            type="button"
          >
            <Images aria-hidden="true" className="size-4" />
            Imagens
          </button>
        </div>
      ) : null}

      {visibleTab === "textos" && textContents.length > 0 ? (
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
                      defaultValue={
                        draftValues[getContentValueKey(content)] ??
                        content.value
                      }
                      id={fieldId}
                      name={`value:${content.id}`}
                      onChange={(event) =>
                        onDraftChange(content, event.currentTarget.value)
                      }
                    />
                  ) : (
                    <input
                      className="min-h-11 w-full rounded-md border border-primary/10 bg-white px-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                      defaultValue={
                        draftValues[getContentValueKey(content)] ??
                        content.value
                      }
                      id={fieldId}
                      name={`value:${content.id}`}
                      onChange={(event) =>
                        onDraftChange(content, event.currentTarget.value)
                      }
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

      {visibleTab === "imagens" && imageContents.length > 0 ? (
        <div className="space-y-4">
          {imageContents.map((content) => (
            <ImageUploadForm
              content={content}
              draftValue={draftValues[getContentValueKey(content)]}
              key={content.id}
              meta={getFieldMeta(content)}
              onDraftChange={onDraftChange}
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
              ainda não pode ser editado.
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

function ConfirmationModal({
  cancelLabel = "Cancelar",
  confirmLabel,
  description,
  formAction,
  hiddenFields = {},
  onClose,
  onConfirm,
  title,
  tone = "primary",
}: ConfirmationModalProps) {
  const isDanger = tone === "danger";

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const confirmButton = (
    <Button
      className="w-full"
      onClick={formAction ? undefined : onConfirm}
      type={formAction ? "submit" : "button"}
      variant={isDanger ? "accent" : "primary"}
    >
      {confirmLabel}
    </Button>
  );

  return (
    <div
      aria-labelledby="confirmation-modal-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary/45 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
    >
      <div
        className="w-full max-w-md rounded-lg border border-primary/10 bg-background p-5 text-foreground shadow-soft sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "inline-flex size-11 shrink-0 items-center justify-center rounded-md",
              isDanger ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
            )}
          >
            <AlertTriangle aria-hidden="true" className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Confirmação
            </p>
            <h3
              className="mt-2 font-serif text-2xl leading-tight text-primary"
              id="confirmation-modal-title"
            >
              {title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button
            className="w-full"
            onClick={onClose}
            type="button"
            variant="secondary"
          >
            {cancelLabel}
          </Button>
          {formAction ? (
            <form action={formAction}>
              {Object.entries(hiddenFields).map(([name, value]) => (
                <input key={name} name={name} type="hidden" value={value} />
              ))}
              {confirmButton}
            </form>
          ) : (
            confirmButton
          )}
        </div>
      </div>
    </div>
  );
}

function CatalogImageField({
  currentImageUrl,
  label,
  onDirtyChange,
}: {
  currentImageUrl?: string;
  label: string;
  onDirtyChange: (isDirty: boolean) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl ?? "");
  const canPreviewImage = isPreviewableImageUrl(previewUrl);
  const fieldId = `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-image`;

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    onDirtyChange(true);

    if (!file) {
      setPreviewUrl(currentImageUrl ?? "");
      return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        setPreviewUrl(reader.result);
      }
    });
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-3">
      <input name="imageUrl" type="hidden" value={currentImageUrl ?? ""} />
      <label className={labelClassName} htmlFor={fieldId}>
        Imagem
      </label>
      <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-primary/10 bg-surface/50">
        {canPreviewImage ? (
          <Image
            alt={label}
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 20rem, 100vw"
            src={previewUrl}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm leading-6 text-muted">
            Selecione uma imagem para o catálogo.
          </div>
        )}
      </div>
      <input
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="block w-full cursor-pointer rounded-md border border-primary/10 bg-white text-sm text-muted file:mr-3 file:min-h-10 file:border-0 file:bg-primary file:px-3 file:text-sm file:font-medium file:text-background"
        id={fieldId}
        name="image"
        onChange={handleImageChange}
        type="file"
      />
      <p className="text-xs leading-5 text-muted">
        JPG, PNG, WebP ou AVIF até 4 MB. A imagem só será salva junto com o
        card.
      </p>
    </div>
  );
}

function CatalogModelForm({
  model,
  onDirtyChange,
}: {
  model?: EditableCatalogModel;
  onDirtyChange: (isDirty: boolean) => void;
}) {
  const [state, formAction, isPending] = useActionState(
    saveCatalogModelAction,
    initialCatalogState
  );
  const isEditing = Boolean(model);

  useEffect(() => {
    if (state.success) {
      onDirtyChange(false);
    }
  }, [onDirtyChange, state.success]);

  return (
    <form
      action={formAction}
      className="space-y-3"
      onChange={() => onDirtyChange(true)}
    >
      <input name="id" type="hidden" value={model?.id ?? ""} />

      <CatalogImageField
        currentImageUrl={model?.imageUrl}
        label={model?.name ?? "Modelo"}
        onDirtyChange={onDirtyChange}
      />

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

function CatalogFabricForm({
  fabric,
  fabricTags,
  onDirtyChange,
}: {
  fabric?: EditableCatalogFabric;
  fabricTags: EditableCatalogFabricTag[];
  onDirtyChange: (isDirty: boolean) => void;
}) {
  const [state, formAction, isPending] = useActionState(
    saveCatalogFabricAction,
    initialCatalogState
  );
  const isEditing = Boolean(fabric);
  const [selectedTags, setSelectedTags] = useState<CatalogFabricTag[]>(() =>
    contentToFabricTags(fabric?.tags ?? "", fabricTags)
  );
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
  const availableTags = fabricTags.filter(
    (tag) => !selectedTags.includes(tag.id)
  );

  function handleTagSelect(tagId: CatalogFabricTag) {
    if (selectedTags.includes(tagId)) {
      return;
    }

    setSelectedTags((currentTags) => [...currentTags, tagId]);
    setIsTagMenuOpen(false);
    onDirtyChange(true);
  }

  function handleTagRemove(tagId: CatalogFabricTag) {
    setSelectedTags((currentTags) =>
      currentTags.filter((currentTag) => currentTag !== tagId)
    );
    onDirtyChange(true);
  }

  useEffect(() => {
    if (state.success) {
      onDirtyChange(false);
    }
  }, [onDirtyChange, state.success]);

  return (
    <form
      action={formAction}
      className="space-y-3"
      onChange={() => onDirtyChange(true)}
    >
      <input name="id" type="hidden" value={fabric?.id ?? ""} />

      <CatalogImageField
        currentImageUrl={fabric?.imageUrl}
        label={fabric?.name ?? "Tecido"}
        onDirtyChange={onDirtyChange}
      />

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
        Descrição
        <textarea
          className={textareaClassName}
          defaultValue={fabric?.description}
          name="description"
          required
        />
      </label>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-foreground">Tags</legend>
        <div className="relative">
          <button
            className={cn(
              inputClassName,
              "flex items-center justify-between text-left",
              availableTags.length === 0 && "cursor-not-allowed opacity-70"
            )}
            disabled={availableTags.length === 0}
            onClick={() => setIsTagMenuOpen((isOpen) => !isOpen)}
            type="button"
          >
            <span>
              {availableTags.length === 0
                ? "Todas as tags foram adicionadas"
                : "Adicionar tag"}
            </span>
            <ChevronDown
              aria-hidden="true"
              className={cn(
                "size-4 text-muted transition",
                isTagMenuOpen && "rotate-180"
              )}
            />
          </button>

          {isTagMenuOpen && availableTags.length > 0 ? (
            <div className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-20 overflow-hidden rounded-md border border-primary/10 bg-white p-1 shadow-soft">
              {availableTags.map((tag) => {
                const Icon = getFabricTagIcon(tag.icon);

                return (
                  <button
                    className="flex min-h-10 w-full items-center gap-3 rounded px-3 text-left text-sm text-foreground transition hover:bg-surface hover:text-primary"
                    key={tag.id}
                    onClick={() => handleTagSelect(tag.id)}
                    type="button"
                  >
                    <Icon aria-hidden="true" className="size-4 text-accent" />
                    {tag.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        {selectedTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tagId) => {
              const tag = fabricTags.find((fabricTag) => fabricTag.id === tagId);

              if (!tag) {
                return null;
              }

              const Icon = getFabricTagIcon(tag.icon);

              return (
                <span
                  className="inline-flex min-h-9 items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 text-sm font-medium text-primary"
                  key={tag.id}
                >
                  <input name="tags" type="hidden" value={tag.id} />
                  <Icon aria-hidden="true" className="size-4 text-accent" />
                  {tag.label}
                  <button
                    aria-label={`Remover tag ${tag.label}`}
                    className="inline-flex size-5 items-center justify-center rounded-full text-muted transition hover:bg-primary/10 hover:text-primary"
                    onClick={() => handleTagRemove(tag.id)}
                    type="button"
                  >
                    <X aria-hidden="true" className="size-3.5" />
                  </button>
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-xs leading-5 text-muted">
            Nenhuma tag adicionada.
          </p>
        )}
      </fieldset>

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

function CatalogFabricTagForm({
  onDirtyChange,
}: {
  onDirtyChange: (isDirty: boolean) => void;
}) {
  const [state, formAction, isPending] = useActionState(
    createCatalogFabricTagAction,
    initialCatalogState
  );
  const [selectedIcon, setSelectedIcon] =
    useState<(typeof fabricTagIconOptions)[number]["id"]>("paw-print");

  useEffect(() => {
    if (state.success) {
      onDirtyChange(false);
    }
  }, [onDirtyChange, state.success]);

  return (
    <form
      action={formAction}
      className="space-y-4"
      onChange={() => onDirtyChange(true)}
    >
      <label className={labelClassName}>
        Nome da tag
        <input className={inputClassName} name="label" required />
      </label>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-foreground">Ícone</legend>
        <input name="icon" type="hidden" value={selectedIcon} />
        <div className="grid grid-cols-3 gap-2">
          {fabricTagIconOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedIcon === option.id;

            return (
              <button
                className={cn(
                  "flex min-h-20 flex-col items-center justify-center gap-2 rounded-md border px-2 text-center text-xs font-medium transition",
                  isSelected
                    ? "border-primary bg-primary text-background shadow-soft"
                    : "border-primary/10 bg-white text-primary hover:border-accent/50 hover:bg-surface"
                )}
                key={option.id}
                onClick={() => {
                  setSelectedIcon(option.id);
                  onDirtyChange(true);
                }}
                type="button"
              >
                <Icon aria-hidden="true" className="size-5" />
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <CatalogFeedback state={state} />

      <Button className="w-full" disabled={isPending} type="submit">
        <Save aria-hidden="true" className="size-4" />
        {isPending ? "Salvando..." : "Criar tag"}
      </Button>
    </form>
  );
}

function CatalogFabricTagsManager({
  fabricTags,
  isCreatingTag,
  onCreateNew,
  onDirtyChange,
}: {
  fabricTags: EditableCatalogFabricTag[];
  isCreatingTag: boolean;
  onCreateNew: () => void;
  onDirtyChange: (isDirty: boolean) => void;
}) {
  const [tagToDelete, setTagToDelete] =
    useState<EditableCatalogFabricTag | null>(null);

  return (
    <div className="space-y-4">
      <Button
        className="w-full"
        onClick={onCreateNew}
        type="button"
        variant="secondary"
      >
        <Plus aria-hidden="true" className="size-4" />
        Nova tag
      </Button>

      {isCreatingTag ? (
        <div className="space-y-4 rounded-md border border-primary/10 bg-white p-3">
          <div>
            <p className="text-sm font-semibold text-primary">Nova tag</p>
            <p className="mt-1 text-xs leading-5 text-muted">
              Defina o nome e o ícone que serão exibidos no catálogo.
            </p>
          </div>
          <CatalogFabricTagForm onDirtyChange={onDirtyChange} />
        </div>
      ) : null}

      <div className="space-y-2">
        {fabricTags.map((tag) => {
          const Icon = getFabricTagIcon(tag.icon);

          return (
            <div
              className="flex items-center justify-between gap-3 rounded-md border border-primary/10 bg-white p-3"
              key={tag.id}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/5 text-accent">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-primary">
                    {tag.label}
                  </p>
                  <p className="truncate text-xs text-muted">{tag.id}</p>
                </div>
              </div>
              <Button
                aria-label={`Excluir tag ${tag.label}`}
                className="shrink-0 px-3 text-accent"
                onClick={() => setTagToDelete(tag)}
                size="sm"
                type="button"
                variant="secondary"
              >
                <Trash2 aria-hidden="true" className="size-4" />
              </Button>
            </div>
          );
        })}
      </div>

      {tagToDelete ? (
        <ConfirmationModal
          confirmLabel="Excluir tag"
          description="Esta ação remove a tag da lista e também retira essa tag dos tecidos que a utilizam."
          formAction={deleteCatalogFabricTagAction}
          hiddenFields={{ id: tagToDelete.id }}
          onClose={() => setTagToDelete(null)}
          title={`Deseja excluir a tag ${tagToDelete.label}?`}
          tone="danger"
        />
      ) : null}
    </div>
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
  const [confirmationAction, setConfirmationAction] = useState<
    "toggle" | "delete" | null
  >(null);

  const confirmation =
    confirmationAction === "delete"
      ? {
          action: deleteAction,
          confirmLabel: "Excluir item",
          description:
            "Esta ação remove o item do catálogo. Confirme apenas se deseja excluir este registro.",
          title: "Deseja excluir este item?",
          tone: "danger" as const,
        }
      : confirmationAction === "toggle"
      ? {
          action: toggleAction,
          confirmLabel: active ? "Desativar item" : "Ativar item",
          description: active
            ? "O item deixará de aparecer no catálogo público, mas poderá ser ativado novamente depois."
            : "O item voltará a aparecer no catálogo público conforme a ordenação definida.",
          title: active
            ? "Deseja desativar este item?"
            : "Deseja ativar este item?",
          tone: active ? ("danger" as const) : ("primary" as const),
        }
      : null;

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          className="w-full"
          onClick={() => setConfirmationAction("toggle")}
          type="button"
          variant="secondary"
        >
          <Power aria-hidden="true" className="size-4" />
          {active ? "Desativar" : "Ativar"}
        </Button>

        <Button
          className="w-full text-accent"
          onClick={() => setConfirmationAction("delete")}
          type="button"
          variant="secondary"
        >
          <Trash2 aria-hidden="true" className="size-4" />
          Remover
        </Button>
      </div>

      {confirmation ? (
        <ConfirmationModal
          confirmLabel={confirmation.confirmLabel}
          description={confirmation.description}
          formAction={confirmation.action}
          hiddenFields={{ id }}
          onClose={() => setConfirmationAction(null)}
          title={confirmation.title}
          tone={confirmation.tone}
        />
      ) : null}
    </>
  );
}

function DashboardHome({
  catalogFabricsCount,
  catalogModelsCount,
  onNavigate,
  userEmail,
  whatsappClickCount,
}: {
  catalogFabricsCount: number;
  catalogModelsCount: number;
  onNavigate: (viewId: AdminViewId) => void;
  userEmail?: string | null;
  whatsappClickCount: number;
}) {
  const summaryCards = [
    {
      label: "Cliques no WhatsApp",
      value: whatsappClickCount,
      icon: MousePointerClick,
    },
    {
      label: "Itens no catálogo",
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
            ? `Sessão ativa para ${userEmail}.`
            : "Sessão administrativa ativa."}{" "}
          Use os atalhos para editar o site e revisar o catálogo.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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

      <div className="grid gap-3 md:grid-cols-2">
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
          Ver catálogo
        </Button>
      </div>
    </section>
  );
}

function DashboardSidePanel({
  catalogFabricsCount,
  catalogModelsCount,
  whatsappClickCount,
}: {
  catalogFabricsCount: number;
  catalogModelsCount: number;
  whatsappClickCount: number;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-md border border-primary/10 bg-white p-4">
        <p className="text-sm font-semibold text-primary">Resumo rápido</p>
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
            <dt>WhatsApp</dt>
            <dd className="font-medium text-primary">{whatsappClickCount}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-md border border-primary/10 bg-white p-4 text-sm leading-6 text-muted">
        A rota interna de métricas já está preparada para registrar cliques de
        WhatsApp quando os botões públicos forem conectados.
      </div>
    </div>
  );
}

function SitePreview({
  previewValues,
  previewMode,
  section,
  setPreviewMode,
}: {
  previewValues: SiteContentValues;
  previewMode: PreviewMode;
  section: AdminSiteSection;
  setPreviewMode: (mode: PreviewMode) => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewAreaRef = useRef<HTMLDivElement>(null);
  const [iframeLoadCount, setIframeLoadCount] = useState(0);
  const [previewAreaSize, setPreviewAreaSize] = useState({
    height: 0,
    width: 0,
  });
  const activeMode =
    previewModes.find((mode) => mode.id === previewMode) ?? previewModes[0];
  const previewSrc = `/admin/preview?section=${section.id}`;
  const previewScale =
    previewAreaSize.width && previewAreaSize.height
      ? Math.max(
          0.25,
          Math.min(
            (previewAreaSize.width - 24) / activeMode.width,
            (previewAreaSize.height - 24) / activeMode.height
          )
        )
      : 1;

  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        sectionId: section.id,
        type: previewMessageType,
        values: previewValues,
      },
      window.location.origin
    );
  }, [iframeLoadCount, previewValues, section.id]);

  useEffect(() => {
    const previewArea = previewAreaRef.current;

    if (!previewArea) {
      return;
    }

    const updatePreviewAreaSize = () => {
      const rect = previewArea.getBoundingClientRect();

      setPreviewAreaSize({
        height: rect.height,
        width: rect.width,
      });
    };
    const resizeObserver = new ResizeObserver(updatePreviewAreaSize);

    updatePreviewAreaSize();
    resizeObserver.observe(previewArea);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <section className="flex min-h-0 flex-1 flex-col lg:h-full">
      <div className="mb-4 shrink-0 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
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
                  isSelected && "bg-primary text-background hover:bg-primary"
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

      <div
        className="flex flex-1 items-center justify-center overflow-hidden rounded-lg border border-primary/10 bg-surface/25 p-3 shadow-soft"
        ref={previewAreaRef}
        style={{
          minHeight: activeMode.height * previewScale + 24,
        }}
      >
        <div
          className="relative shrink-0 transition-all"
          style={{
            height: activeMode.height * previewScale,
            width: activeMode.width * previewScale,
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 overflow-hidden rounded-md bg-white shadow-soft transition-transform"
            style={{
              height: activeMode.height,
              transform: `translate(-50%, -50%) scale(${previewScale})`,
              transformOrigin: "center",
              width: activeMode.width,
            }}
          >
            <iframe
              className="h-full w-full border-0 bg-white"
              onLoad={() => setIframeLoadCount((count) => count + 1)}
              ref={iframeRef}
              src={previewSrc}
              title={`Preview da seção ${section.label}`}
            />
          </div>
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
    ["armSize", "Braço"],
    ["structure", "Estrutura"],
  ] as const;

  return (
    <article
      aria-pressed={isSelected}
      className={cn(
        "cursor-pointer overflow-hidden rounded-lg border bg-background text-left shadow-soft transition md:grid md:grid-cols-[3fr_2fr]",
        isSelected
          ? "border-primary ring-2 ring-primary/10"
          : "border-primary/10 hover:border-accent/40"
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
                : "border-accent/25 text-accent"
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
  fabricTags,
  fabric,
  isSelected,
  onSelect,
}: {
  fabricTags: EditableCatalogFabricTag[];
  fabric: EditableCatalogFabric;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const tags = contentToFabricTags(fabric.tags, fabricTags);

  return (
    <article
      aria-pressed={isSelected}
      className={cn(
        "cursor-pointer overflow-hidden rounded-lg border bg-background text-left shadow-soft transition",
        isSelected
          ? "border-primary ring-2 ring-primary/10"
          : "border-primary/10 hover:border-accent/40"
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

            const Icon = getFabricTagIcon(tag.icon);

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
                : "border-accent/25 text-accent"
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
          Catálogo
        </p>
        <h2 className="font-serif text-3xl text-primary">Modelos</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Selecione um card para editar os dados no painel lateral. Esta área
          não carrega o site público em iframe.
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
  fabricTags,
  fabrics,
  onSelect,
  selectedFabricId,
}: {
  fabricTags: EditableCatalogFabricTag[];
  fabrics: EditableCatalogFabric[];
  onSelect: (id: string) => void;
  selectedFabricId: string | null;
}) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Catálogo
        </p>
        <h2 className="font-serif text-3xl text-primary">Tecidos</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Os cards seguem a estrutura visual atual do catálogo e podem ser
          selecionados para edição no painel lateral.
        </p>
      </div>

      {fabrics.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {fabrics.map((fabric) => (
            <CatalogFabricPreviewCard
              fabricTags={fabricTags}
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
  editMode,
  onCreateNew,
  onDirtyChange,
  selectedModel,
}: {
  editMode: CatalogEditMode;
  onCreateNew: () => void;
  onDirtyChange: (isDirty: boolean) => void;
  selectedModel: EditableCatalogModel | null;
}) {
  return (
    <div className="space-y-4">
      <Button
        className="w-full"
        onClick={onCreateNew}
        type="button"
        variant="secondary"
      >
        <Plus aria-hidden="true" className="size-4" />
        Novo modelo
      </Button>

      {editMode === "new" ? (
        <div className="space-y-4 rounded-md border border-primary/10 bg-white p-3">
          <div>
            <p className="text-sm font-semibold text-primary">Novo modelo</p>
            <p className="mt-1 text-xs leading-5 text-muted">
              Preencha os campos e salve para criar o card.
            </p>
          </div>
          <CatalogModelForm key="new-model" onDirtyChange={onDirtyChange} />
        </div>
      ) : selectedModel ? (
        <div className="space-y-4 rounded-md border border-primary/10 bg-white p-3">
          <div>
            <p className="text-sm font-semibold text-primary">
              Editando {selectedModel.name}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted">
              Ordem {selectedModel.sortOrder} · {selectedModel.category}
            </p>
          </div>
          <CatalogModelForm
            key={selectedModel.id}
            model={selectedModel}
            onDirtyChange={onDirtyChange}
          />
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
  editMode,
  fabricTags,
  isCreatingTag,
  onCreateNew,
  onDirtyChange,
  onPanelTabChange,
  onTagCreateNew,
  panelTab,
  selectedFabric,
}: {
  editMode: CatalogEditMode;
  fabricTags: EditableCatalogFabricTag[];
  isCreatingTag: boolean;
  onCreateNew: () => void;
  onDirtyChange: (isDirty: boolean) => void;
  onPanelTabChange: (tab: FabricPanelTab) => void;
  onTagCreateNew: () => void;
  panelTab: FabricPanelTab;
  selectedFabric: EditableCatalogFabric | null;
}) {
  return (
    <div className="space-y-4">
      <div
        aria-label="Área de edição de tecidos"
        className="grid grid-cols-2 rounded-md border border-primary/10 bg-white p-1 shadow-soft"
        role="tablist"
      >
        <button
          aria-selected={panelTab === "tecido"}
          className={cn(
            "flex min-h-10 items-center justify-center gap-2 rounded px-3 text-sm font-medium transition",
            panelTab === "tecido"
              ? "bg-primary text-white"
              : "text-muted hover:text-primary"
          )}
          onClick={() => onPanelTabChange("tecido")}
          role="tab"
          type="button"
        >
          <ScrollText aria-hidden="true" className="size-4" />
          Editar tecido
        </button>
        <button
          aria-selected={panelTab === "tags"}
          className={cn(
            "flex min-h-10 items-center justify-center gap-2 rounded px-3 text-sm font-medium transition",
            panelTab === "tags"
              ? "bg-primary text-white"
              : "text-muted hover:text-primary"
          )}
          onClick={() => onPanelTabChange("tags")}
          role="tab"
          type="button"
        >
          <Palette aria-hidden="true" className="size-4" />
          Tags
        </button>
      </div>

      {panelTab === "tags" ? (
        <CatalogFabricTagsManager
          fabricTags={fabricTags}
          isCreatingTag={isCreatingTag}
          onCreateNew={onTagCreateNew}
          onDirtyChange={onDirtyChange}
        />
      ) : (
        <>
          <Button
            className="w-full"
            onClick={onCreateNew}
            type="button"
            variant="secondary"
          >
            <Plus aria-hidden="true" className="size-4" />
            Novo tecido
          </Button>

          {editMode === "new" ? (
            <div className="space-y-4 rounded-md border border-primary/10 bg-white p-3">
              <div>
                <p className="text-sm font-semibold text-primary">Novo tecido</p>
                <p className="mt-1 text-xs leading-5 text-muted">
                  Selecione as tags e salve para criar o card.
                </p>
              </div>
              <CatalogFabricForm
                fabricTags={fabricTags}
                key="new-fabric"
                onDirtyChange={onDirtyChange}
              />
            </div>
          ) : selectedFabric ? (
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
              <CatalogFabricForm
                fabric={selectedFabric}
                fabricTags={fabricTags}
                key={selectedFabric.id}
                onDirtyChange={onDirtyChange}
              />
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
        </>
      )}
    </div>
  );
}

export function AdminEditorLayout({
  catalogFabrics,
  catalogFabricTags,
  catalogModels,
  contents,
  userEmail,
  whatsappClickCount,
}: AdminEditorLayoutProps) {
  const [selectedViewId, setSelectedViewId] =
    useState<AdminViewId>("dashboard");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [selectedFabricId, setSelectedFabricId] = useState<string | null>(null);
  const [modelEditMode, setModelEditMode] = useState<CatalogEditMode>(null);
  const [fabricEditMode, setFabricEditMode] = useState<CatalogEditMode>(null);
  const [fabricPanelTab, setFabricPanelTab] =
    useState<FabricPanelTab>("tecido");
  const [isCreatingFabricTag, setIsCreatingFabricTag] = useState(false);
  const [catalogFormDirty, setCatalogFormDirty] = useState(false);
  const [pendingDiscardAction, setPendingDiscardAction] = useState<
    (() => void) | null
  >(null);
  const [siteContentDrafts, setSiteContentDrafts] = useState<SiteContentValues>(
    {}
  );

  const runOrConfirmCatalogDiscard = useCallback(
    (action: () => void) => {
      if (!catalogFormDirty) {
        action();
        return;
      }

      setPendingDiscardAction(() => action);
    },
    [catalogFormDirty]
  );

  const closePendingDiscardConfirmation = useCallback(() => {
    setPendingDiscardAction(null);
  }, []);

  const confirmPendingDiscard = useCallback(() => {
    pendingDiscardAction?.();
    setPendingDiscardAction(null);
  }, [pendingDiscardAction]);

  const clearCatalogDirtyState = useCallback(() => {
    setCatalogFormDirty(false);
  }, []);

  const handleViewChange = useCallback(
    (viewId: AdminViewId) => {
      if (viewId === selectedViewId) {
        return;
      }

      runOrConfirmCatalogDiscard(() => {
        clearCatalogDirtyState();
        setSelectedViewId(viewId);
      });
    },
    [clearCatalogDirtyState, runOrConfirmCatalogDiscard, selectedViewId]
  );

  const handleModelEditModeChange = useCallback(
    (editMode: CatalogEditMode) => {
      if (modelEditMode === editMode) {
        return;
      }

      runOrConfirmCatalogDiscard(() => {
        clearCatalogDirtyState();
        setModelEditMode(editMode);
        setSelectedModelId(
          editMode?.startsWith("edit:") ? editMode.replace("edit:", "") : null
        );
      });
    },
    [clearCatalogDirtyState, modelEditMode, runOrConfirmCatalogDiscard]
  );

  const handleFabricEditModeChange = useCallback(
    (editMode: CatalogEditMode) => {
      if (fabricEditMode === editMode) {
        return;
      }

      runOrConfirmCatalogDiscard(() => {
        clearCatalogDirtyState();
        setFabricPanelTab("tecido");
        setIsCreatingFabricTag(false);
        setFabricEditMode(editMode);
        setSelectedFabricId(
          editMode?.startsWith("edit:") ? editMode.replace("edit:", "") : null
        );
      });
    },
    [clearCatalogDirtyState, fabricEditMode, runOrConfirmCatalogDiscard]
  );

  const handleFabricPanelTabChange = useCallback(
    (tab: FabricPanelTab) => {
      if (fabricPanelTab === tab) {
        return;
      }

      runOrConfirmCatalogDiscard(() => {
        clearCatalogDirtyState();
        setFabricPanelTab(tab);
        setIsCreatingFabricTag(false);
      });
    },
    [clearCatalogDirtyState, fabricPanelTab, runOrConfirmCatalogDiscard]
  );

  const handleFabricTagCreateNew = useCallback(() => {
    if (isCreatingFabricTag) {
      return;
    }

    runOrConfirmCatalogDiscard(() => {
      clearCatalogDirtyState();
      setFabricPanelTab("tags");
      setFabricEditMode(null);
      setSelectedFabricId(null);
      setIsCreatingFabricTag(true);
    });
  }, [
    clearCatalogDirtyState,
    isCreatingFabricTag,
    runOrConfirmCatalogDiscard,
  ]);

  const handleSiteContentDraftChange = useCallback(
    (content: EditableSiteContent, value: string) => {
      setSiteContentDrafts((currentDrafts) => ({
        ...currentDrafts,
        [getContentValueKey(content)]: value,
      }));
    },
    []
  );

  const selectedSiteSection = useMemo(
    () =>
      isSiteSectionId(selectedViewId)
        ? siteSections.find((section) => section.id === selectedViewId) ?? null
        : null,
    [selectedViewId]
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
    [contents, selectedSiteSection]
  );

  const previewValues = useMemo(
    () => ({
      ...contentsToValues(contents),
      ...siteContentDrafts,
    }),
    [contents, siteContentDrafts]
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
    : "Resumo";

  return (
    <main className="min-h-dvh bg-white text-foreground lg:h-dvh lg:overflow-hidden">
      <div className="flex min-h-dvh flex-col lg:grid lg:h-full lg:min-h-0 lg:grid-cols-[17rem_minmax(0,1fr)_22rem] lg:overflow-clip">
        <aside className="min-h-0 border-b border-primary/10 bg-surface/25 lg:sticky lg:top-0 lg:h-dvh lg:overflow-hidden lg:border-b-0 lg:border-r">
          <div className="flex h-full min-h-0 flex-col">
            <div className="shrink-0 space-y-1 p-4 pb-3 sm:p-5 sm:pb-3">
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
                {userEmail ? `Sessão ativa: ${userEmail}` : "Sessão ativa"}
              </p>
            </div>

            <nav
              aria-label="Navegação do painel"
              className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-3 sm:px-5"
            >
              <SidebarButton
                icon={LayoutDashboard}
                isSelected={selectedViewId === "dashboard"}
                label="Dashboard"
                onClick={() => handleViewChange("dashboard")}
              />

              <SidebarGroup label="Site">
                {siteSections.map((section) => (
                  <SidebarButton
                    icon={section.icon}
                    isSelected={selectedViewId === section.id}
                    key={section.id}
                    label={section.label}
                    onClick={() => handleViewChange(section.id)}
                  />
                ))}
              </SidebarGroup>

              <SidebarGroup label="Catálogo">
                <SidebarButton
                  icon={Sofa}
                  isSelected={selectedViewId === "modelos"}
                  label="Modelos"
                  onClick={() => handleViewChange("modelos")}
                />
                <SidebarButton
                  icon={Palette}
                  isSelected={selectedViewId === "tecidos"}
                  label="Tecidos"
                  onClick={() => handleViewChange("tecidos")}
                />
              </SidebarGroup>
            </nav>

            <form
              action={logoutAction}
              className="shrink-0 border-t border-primary/10 p-4 sm:p-5"
            >
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
              onNavigate={handleViewChange}
              userEmail={userEmail}
              whatsappClickCount={whatsappClickCount}
            />
          ) : null}

          {selectedSiteSection ? (
            <SitePreview
              previewValues={previewValues}
              previewMode={previewMode}
              section={selectedSiteSection}
              setPreviewMode={setPreviewMode}
            />
          ) : null}

          {selectedViewId === "modelos" ? (
            <CatalogModelsWorkspace
              models={catalogModels}
              onSelect={(id) => handleModelEditModeChange(`edit:${id}`)}
              selectedModelId={selectedModelId}
            />
          ) : null}

          {selectedViewId === "tecidos" ? (
            <CatalogFabricsWorkspace
              fabricTags={catalogFabricTags}
              fabrics={catalogFabrics}
              onSelect={(id) => handleFabricEditModeChange(`edit:${id}`)}
              selectedFabricId={selectedFabricId}
            />
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
                  ? "Edite textos e imagens salvos no banco para esta seção."
                  : selectedViewId === "modelos" || selectedViewId === "tecidos"
                  ? "Edite o item selecionado ou crie um novo registro."
                  : "Resumo e preparação das próximas métricas."}
              </p>
            </div>

            {selectedViewId === "dashboard" ? (
              <DashboardSidePanel
                catalogFabricsCount={catalogFabrics.length}
                catalogModelsCount={catalogModels.length}
                whatsappClickCount={whatsappClickCount}
              />
            ) : null}

            {selectedSiteSection ? (
              <ContentFieldsForm
                contents={selectedContents}
                draftValues={siteContentDrafts}
                key={selectedSiteSection.id}
                onDraftChange={handleSiteContentDraftChange}
                section={selectedSiteSection}
              />
            ) : null}

            {selectedViewId === "modelos" ? (
              <CatalogModelManager
                editMode={modelEditMode}
                onCreateNew={() => handleModelEditModeChange("new")}
                onDirtyChange={setCatalogFormDirty}
                selectedModel={selectedModel}
              />
            ) : null}

            {selectedViewId === "tecidos" ? (
              <CatalogFabricManager
                editMode={fabricEditMode}
                fabricTags={catalogFabricTags}
                isCreatingTag={isCreatingFabricTag}
                onCreateNew={() => handleFabricEditModeChange("new")}
                onDirtyChange={setCatalogFormDirty}
                onPanelTabChange={handleFabricPanelTabChange}
                onTagCreateNew={handleFabricTagCreateNew}
                panelTab={fabricPanelTab}
                selectedFabric={selectedFabric}
              />
            ) : null}
          </div>
        </aside>
      </div>

      {pendingDiscardAction ? (
        <ConfirmationModal
          confirmLabel="Descartar alterações"
          description="Você tem alterações não salvas. Deseja sair da edição e descartar essas alterações?"
          onClose={closePendingDiscardConfirmation}
          onConfirm={confirmPendingDiscard}
          title="Sair da edição?"
          tone="danger"
        />
      ) : null}
    </main>
  );
}
