import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AboutSection } from "@/components/sections/AboutSection";
import { BudgetSection } from "@/components/sections/BudgetSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { HeroSection } from "@/components/sections/HeroSection";
import { gallery } from "@/data/gallery";
import { prisma } from "@/lib/prisma";
import { createSiteContentReader } from "@/lib/site-content";

export const dynamic = "force-dynamic";

const galleryImageKeys = [
  "gallery_1_image",
  "gallery_2_image",
  "gallery_3_image",
  "gallery_4_image",
];

export default async function Home() {
  const contents = await prisma.siteContent.findMany({
    select: {
      key: true,
      section: true,
      value: true,
    },
  });

  const content = createSiteContentReader(contents);
  const galleryItems = gallery.map((item, index) => ({
    ...item,
    image: content(
      "inspiracoes",
      galleryImageKeys[index] ?? "",
      item.image,
    ),
  }));

  return (
    <>
      <Header />
      <main>
        <HeroSection
          eyebrow={content(
            "inicio",
            "eyebrow",
            "Estofados personalizados em Curitiba",
          )}
          footerText={content(
            "inicio",
            "hero_footer",
            "Design, conforto e acabamento",
          )}
          imageSrc={content(
            "inicio",
            "hero_image",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=86",
          )}
          title={content(
            "inicio",
            "hero_title",
            "Sofás sob medida para ambientes que merecem presença",
          )}
        />
        <AboutSection
          description={content(
            "sobre",
            "description",
            "A Projete Estofados cria sofás personalizados para quem busca conforto, beleza e exclusividade. Cada detalhe é pensado para valorizar o ambiente e refletir o estilo de quem vive nele.",
          )}
          eyebrow={content("sobre", "eyebrow", "Sobre a Projete")}
          imageSrc={content(
            "sobre",
            "image",
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1100&q=82",
          )}
          stats={[
            {
              title: content("sobre", "stat_1_title", "Sob medida"),
              label: content("sobre", "stat_1_label", "proporção"),
            },
            {
              title: content("sobre", "stat_2_title", "Premium"),
              label: content("sobre", "stat_2_label", "acabamento"),
            },
            {
              title: content("sobre", "stat_3_title", "Curitiba"),
              label: content("sobre", "stat_3_label", "atendimento"),
            },
          ]}
          title={content(
            "sobre",
            "title",
            "Mais do que um sofá, uma peça feita para o seu espaço",
          )}
        />
        <GallerySection
          catalogText={content(
            "inspiracoes",
            "catalog_text",
            "Quer ver mais modelos, acabamentos e inspirações? Acesse nosso catálogo.",
          )}
          description={content(
            "inspiracoes",
            "description",
            "Inspire-se em ambientes criados para unir conforto, elegância e personalidade.",
          )}
          eyebrow={content("inspiracoes", "eyebrow", "Inspirações")}
          galleryItems={galleryItems}
          title={content(
            "inspiracoes",
            "title",
            "Ambientes criados para unir conforto, elegância e personalidade",
          )}
        />
        <BudgetSection
          description={content(
            "orcamento",
            "description",
            "Para uma estimativa mais precisa, envie as principais informações do sofá desejado. Com esses detalhes, o atendimento fica mais claro, ágil e personalizado.",
          )}
          eyebrow={content("orcamento", "eyebrow", "Orçamento sob medida")}
          title={content("orcamento", "title", "Como solicitar seu orçamento")}
        />
        <ContactSection
          addressTitle={content("contato", "address_title", "Endereço")}
          description={content(
            "contato",
            "description",
            "Converse com a Projete Estofados e comece a desenhar uma peça que respeita seu ambiente, sua rotina e seu estilo.",
          )}
          eyebrow={content("contato", "eyebrow", "Contato")}
          hoursTitle={content("contato", "hours_title", "Horário")}
          primaryCta={content(
            "contato",
            "primary_cta",
            "Falar com a Projete Estofados",
          )}
          secondaryCta={content(
            "contato",
            "secondary_cta",
            "Acompanhar no Instagram",
          )}
          socialTitle={content("contato", "social_title", "Redes sociais")}
          title={content(
            "contato",
            "title",
            "Pronto para criar o sofá ideal para sua casa?",
          )}
        />
      </main>
      <Footer />
    </>
  );
}
