# Projete Estofados

Landing page institucional para a Projete Estofados, criada com Next.js App Router, TypeScript, Tailwind CSS, Shadcn/UI, Lucide React e Framer Motion.

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Ambiente

Configure a conexao PostgreSQL do Neon usando `sslmode=verify-full` e
`channel_binding=require`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=verify-full&channel_binding=require"
```

Com `@prisma/adapter-pg`, `pg` e Neon, `sslmode=verify-full` preserva o
comportamento seguro esperado e evita o warning sobre aliases de SSL mode.

O painel administrativo usa Vercel Blob para trocar imagens editaveis. Configure
`BLOB_READ_WRITE_TOKEN` no ambiente local e no projeto da Vercel antes de enviar
imagens pelo admin.

## Conteúdo

- Informações da marca: `src/constants/brand.ts`
- Links de WhatsApp, Instagram e mapa: `src/constants/links.ts`
- Imagens placeholder: `src/data/gallery.ts` e seções com `next/image`
- Identidade visual e paleta: `tailwind.config.ts`

As imagens atuais são placeholders premium remotos e podem ser substituídas por fotos reais da marca mantendo os mesmos campos `image` e `alt`.
