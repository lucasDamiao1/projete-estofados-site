import bcrypt from "bcrypt";
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = credentialsSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = Boolean(session?.user);
      const isLoginPage = nextUrl.pathname === "/admin/login";

      if (isLoginPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/admin/dashboard", nextUrl));
        }

        return true;
      }

      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? token.sub ?? "");
      }

      return session;
    },
  },
} satisfies NextAuthConfig);
