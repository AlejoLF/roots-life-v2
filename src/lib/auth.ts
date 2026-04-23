import NextAuth, { type DefaultSession } from 'next-auth';
import type { Provider } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Facebook from 'next-auth/providers/facebook';
import { getSupabaseAdmin } from './supabase';
import { verifyPassword } from './password';

/**
 * NextAuth.js (Auth.js v5) configuration.
 *
 * Providers:
 *  - Credentials (email + password con bcrypt)
 *  - Google (OAuth — requiere GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET)
 *  - Facebook (OAuth — requiere FACEBOOK_CLIENT_ID y FACEBOOK_CLIENT_SECRET)
 *
 * Strategy: JWT sessions (no DB sessions). Simpler para Vercel serverless.
 * El usuario sí persiste en Supabase; solo la session vive en JWT.
 */

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      emailVerified: Date | null;
    } & DefaultSession['user'];
  }
  interface User {
    id: string;
    emailVerified?: Date | null;
  }
}

const providers: Provider[] = [
  Credentials({
    name: 'email-password',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const email = String(credentials.email).trim().toLowerCase();
      const password = String(credentials.password);

      const supabase = getSupabaseAdmin();
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, hashed_password, name, image, email_verified')
        .eq('email', email)
        .maybeSingle();

      if (error || !user || !user.hashed_password) return null;

      const valid = await verifyPassword(password, user.hashed_password);
      if (!valid) return null;

      if (!user.email_verified) {
        throw new Error('EMAIL_NOT_VERIFIED');
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name ?? undefined,
        image: user.image ?? undefined,
        emailVerified: user.email_verified
          ? new Date(user.email_verified)
          : null,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 30 }, // 30 días
  pages: {
    signIn: '/login',
    error: '/login',
  },
  trustHost: true,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'credentials') return true;

      // OAuth signup: crear o asociar user en Supabase
      if (!user.email) return false;

      const supabase = getSupabaseAdmin();
      const { data: existing } = await supabase
        .from('users')
        .select('id, email_verified')
        .eq('email', user.email.toLowerCase())
        .maybeSingle();

      if (existing) {
        // User ya existe: completar email_verified si faltaba
        if (!existing.email_verified) {
          await supabase
            .from('users')
            .update({ email_verified: new Date().toISOString() })
            .eq('id', existing.id);
        }
        user.id = existing.id;
        return true;
      }

      // User nuevo via OAuth: insert
      const { data: created, error } = await supabase
        .from('users')
        .insert({
          email: user.email.toLowerCase(),
          name: user.name ?? null,
          image: user.image ?? null,
          email_verified: new Date().toISOString(),
          terms_accepted_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (error || !created) return false;
      user.id = created.id;
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.emailVerified = user.emailVerified ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
        session.user.emailVerified =
          (token.emailVerified as Date | null) ?? null;
      }
      return session;
    },
  },
});
