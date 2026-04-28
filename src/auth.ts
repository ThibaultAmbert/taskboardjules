import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      id: "demo",
      name: "Demo Mode",
      credentials: {
        email: { label: "Email", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string || "demo@example.com";
        const name = email.split('@')[0];

        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: name.charAt(0).toUpperCase() + name.slice(1),
              role: email === "thibault.ambert@wivoo.fr" ? "ADMIN" : "USER",
            },
          });
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      if (session.user) {
        if (user) {
            session.user.id = user.id;
            // @ts-expect-error role is added to user
            session.user.role = user.role;
        } else if (token) {
            session.user.id = token.sub as string;
            // @ts-expect-error role is added to token
            session.user.role = token.role as string;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
        if (user) {
            token.role = (user as { role?: string }).role;
        }
        return token;
    },
    async signIn({ user }) {
        if (user.email === "thibault.ambert@wivoo.fr") {
            const existingUser = await prisma.user.findUnique({
                where: { email: user.email }
            });
            if (existingUser && existingUser.role !== "ADMIN") {
                await prisma.user.update({
                    where: { email: user.email },
                    data: { role: "ADMIN" }
                });
            }
        }
        return true;
    }
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
});
