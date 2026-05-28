import { brand } from "@/constants/brand";
import type { NavItem } from "@/types";

export const site = {
  url: "https://projete-estofados.vercel.app",
  title: "Projete Estofados | Sofás sob medida em Curitiba",
  description:
    "Sofás personalizados que unem conforto, elegância e acabamento impecável para transformar ambientes em Curitiba.",
  navItems: [
    { label: "Início", href: "/#inicio" },
    { label: "Sobre", href: "/#sobre" },
    { label: "Inspirações", href: "/#inspiracoes" },
    { label: "Orçamento", href: "/#orcamento" },
    { label: "Contato", href: "/#contato" },
  ] satisfies NavItem[],
  brandName: brand.name,
};
