import { config as loadEnv } from "dotenv";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const connectionString = process.env.DATABASE_URL;
const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD;
const adminName = process.env.ADMIN_NAME?.trim() || "Administrador";

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

if (!adminEmail || !adminPassword) {
  throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to seed the admin user.");
}

const seedAdmin = {
  email: adminEmail,
  password: adminPassword,
  name: adminName,
};

const siteContents = [
  {
    section: "inicio",
    key: "eyebrow",
    type: "text",
    value: "Estofados personalizados em Curitiba",
  },
  {
    section: "inicio",
    key: "hero_title",
    type: "textarea",
    value: "Sofas sob medida para ambientes que merecem presenca",
  },
  {
    section: "inicio",
    key: "hero_footer",
    type: "text",
    value: "Design, conforto e acabamento",
  },
  {
    section: "inicio",
    key: "hero_image",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=86",
  },
  {
    section: "sobre",
    key: "eyebrow",
    type: "text",
    value: "Sobre a Projete",
  },
  {
    section: "sobre",
    key: "title",
    type: "textarea",
    value: "Mais do que um sofa, uma peca feita para o seu espaco",
  },
  {
    section: "sobre",
    key: "description",
    type: "textarea",
    value:
      "A Projete Estofados cria sofas personalizados para quem busca conforto, beleza e exclusividade. Cada detalhe e pensado para valorizar o ambiente e refletir o estilo de quem vive nele.",
  },
  {
    section: "sobre",
    key: "image",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1100&q=82",
  },
  {
    section: "sobre",
    key: "stat_1_title",
    type: "text",
    value: "Sob medida",
  },
  {
    section: "sobre",
    key: "stat_1_label",
    type: "text",
    value: "proporcao",
  },
  {
    section: "sobre",
    key: "stat_2_title",
    type: "text",
    value: "Premium",
  },
  {
    section: "sobre",
    key: "stat_2_label",
    type: "text",
    value: "acabamento",
  },
  {
    section: "sobre",
    key: "stat_3_title",
    type: "text",
    value: "Curitiba",
  },
  {
    section: "sobre",
    key: "stat_3_label",
    type: "text",
    value: "atendimento",
  },
  {
    section: "inspiracoes",
    key: "eyebrow",
    type: "text",
    value: "Inspiracoes",
  },
  {
    section: "inspiracoes",
    key: "title",
    type: "textarea",
    value: "Ambientes criados para unir conforto, elegancia e personalidade",
  },
  {
    section: "inspiracoes",
    key: "description",
    type: "textarea",
    value:
      "Inspire-se em ambientes criados para unir conforto, elegancia e personalidade.",
  },
  {
    section: "inspiracoes",
    key: "catalog_text",
    type: "textarea",
    value:
      "Quer ver mais modelos, acabamentos e inspiracoes? Acesse nosso catalogo.",
  },
  {
    section: "inspiracoes",
    key: "gallery_1_image",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=82&w=1200",
  },
  {
    section: "inspiracoes",
    key: "gallery_2_image",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=82&w=900",
  },
  {
    section: "inspiracoes",
    key: "gallery_3_image",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=82&w=900",
  },
  {
    section: "inspiracoes",
    key: "gallery_4_image",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=82&w=1200",
  },
  {
    section: "orcamento",
    key: "eyebrow",
    type: "text",
    value: "Orcamento sob medida",
  },
  {
    section: "orcamento",
    key: "title",
    type: "text",
    value: "Como solicitar seu orcamento",
  },
  {
    section: "orcamento",
    key: "description",
    type: "textarea",
    value:
      "Para uma estimativa mais precisa, envie as principais informacoes do sofa desejado. Com esses detalhes, o atendimento fica mais claro, agil e personalizado.",
  },
  {
    section: "contato",
    key: "eyebrow",
    type: "text",
    value: "Contato",
  },
  {
    section: "contato",
    key: "title",
    type: "textarea",
    value: "Pronto para criar o sofa ideal para sua casa?",
  },
  {
    section: "contato",
    key: "description",
    type: "textarea",
    value:
      "Converse com a Projete Estofados e comece a desenhar uma peca que respeita seu ambiente, sua rotina e seu estilo.",
  },
  {
    section: "contato",
    key: "primary_cta",
    type: "text",
    value: "Falar com a Projete Estofados",
  },
  {
    section: "contato",
    key: "secondary_cta",
    type: "text",
    value: "Acompanhar no Instagram",
  },
  {
    section: "contato",
    key: "address_title",
    type: "text",
    value: "Endereco",
  },
  {
    section: "contato",
    key: "hours_title",
    type: "text",
    value: "Horario",
  },
  {
    section: "contato",
    key: "social_title",
    type: "text",
    value: "Redes sociais",
  },
];

const catalogModels = [
  {
    id: "sofa-modular",
    name: "Sofa modular",
    imageUrl:
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&q=82&w=1000",
    category: "Sofa modular sob medida",
    size: "3,20 m",
    fabric: "Linho texturizado",
    armSize: "Braco de 18 cm",
    structure: "Fixo",
    whatsappMessage:
      "Ola! Tenho interesse no modelo Sofa modular. Gostaria de mais informacoes sobre medidas, tecidos e orcamento.",
    active: true,
    sortOrder: 10,
  },
  {
    id: "sofa-retratil",
    name: "Sofa retratil",
    imageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=82&w=1000",
    category: "Sofa retratil para sala",
    size: "2,80 m",
    fabric: "Veludo premium",
    armSize: "Braco de 20 cm",
    structure: "Retratil",
    whatsappMessage:
      "Ola! Tenho interesse no modelo Sofa retratil. Gostaria de mais informacoes sobre medidas, tecidos e orcamento.",
    active: true,
    sortOrder: 20,
  },
  {
    id: "chaise-sob-medida",
    name: "Chaise sob medida",
    imageUrl:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=82&w=1000",
    category: "Sofa com chaise",
    size: "3,00 m x 1,60 m",
    fabric: "Boucle",
    armSize: "Braco de 16 cm",
    structure: "Fixo com chaise",
    whatsappMessage:
      "Ola! Tenho interesse no modelo Chaise sob medida. Gostaria de mais informacoes sobre medidas, tecidos e orcamento.",
    active: true,
    sortOrder: 30,
  },
];

const catalogFabrics = [
  {
    id: "linho-texturizado",
    name: "Linho texturizado",
    imageUrl: "/images/catalogo/tecidos/linho.webp",
    description:
      "Tecido com trama aparente e toque natural, ideal para composicoes leves, acolhedoras e atemporais.",
    tags: "pet-friendly,premium",
    active: true,
    sortOrder: 10,
  },
  {
    id: "veludo-premium",
    name: "Veludo premium",
    imageUrl: "/images/catalogo/tecidos/veludo.avif",
    description:
      "Acabamento macio e elegante, indicado para projetos que pedem presenca visual e sensacao extra de conforto.",
    tags: "premium",
    active: true,
    sortOrder: 20,
  },
  {
    id: "boucle",
    name: "Boucle",
    imageUrl: "/images/catalogo/tecidos/boucle.webp",
    description:
      "Textura marcante e visual contemporaneo, perfeito para destacar o sofa como peca central do ambiente.",
    tags: "pet-friendly,impermeavel",
    active: true,
    sortOrder: 30,
  },
];

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash(seedAdmin.password, 12);

  await prisma.user.upsert({
    where: { email: seedAdmin.email },
    update: {
      name: seedAdmin.name,
      password,
    },
    create: {
      name: seedAdmin.name,
      email: seedAdmin.email,
      password,
    },
  });

  await Promise.all(
    siteContents.map((content) =>
      prisma.siteContent.upsert({
        where: {
          section_key: {
            section: content.section,
            key: content.key,
          },
        },
        update: {
          type: content.type,
        },
        create: content,
      }),
    ),
  );

  await Promise.all(
    catalogModels.map((model) =>
      prisma.catalogModel.upsert({
        where: {
          id: model.id,
        },
        update: {
          name: model.name,
          imageUrl: model.imageUrl,
          category: model.category,
          size: model.size,
          fabric: model.fabric,
          armSize: model.armSize,
          structure: model.structure,
          whatsappMessage: model.whatsappMessage,
          active: model.active,
          sortOrder: model.sortOrder,
        },
        create: model,
      }),
    ),
  );

  await Promise.all(
    catalogFabrics.map((fabric) =>
      prisma.catalogFabric.upsert({
        where: {
          id: fabric.id,
        },
        update: {
          name: fabric.name,
          imageUrl: fabric.imageUrl,
          description: fabric.description,
          tags: fabric.tags,
          active: fabric.active,
          sortOrder: fabric.sortOrder,
        },
        create: fabric,
      }),
    ),
  );

  console.log(`Admin user ready: ${seedAdmin.email}`);
  console.log(`Site content ready: ${siteContents.length} fields`);
  console.log(`Catalog models ready: ${catalogModels.length} items`);
  console.log(`Catalog fabrics ready: ${catalogFabrics.length} items`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
