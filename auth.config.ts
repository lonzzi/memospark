import type { NextAuthConfig } from 'next-auth';

export const config = {
  trustHost: true,
  basePath: '/auth',
  callbacks: {
    authorized({ request: { nextUrl }, auth }) {
      if (nextUrl.pathname === '/dashboard') return !!auth;
      return true;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/login',
  },
  providers: [],
} satisfies NextAuthConfig;

export default config;
