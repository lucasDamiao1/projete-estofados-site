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

  console.log(`Admin user ready: ${seedAdmin.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
