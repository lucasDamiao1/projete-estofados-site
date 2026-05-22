import { brand } from "@/constants/brand";

const whatsappMessage = encodeURIComponent(
  "Olá, Projete Estofados! Gostaria de solicitar um orçamento para um sofá sob medida.",
);

export const links = {
  instagram: "https://www.instagram.com/projeteestofados_/",
  whatsapp: `https://wa.me/${brand.whatsappNumber}?text=${whatsappMessage}`,
  maps: "https://www.google.com/maps/search/?api=1&query=Av.%20Comendador%20Franco%2C%202485%20-%20Curitiba",
};
