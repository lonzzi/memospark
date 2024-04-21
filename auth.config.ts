import type { NextAuthConfig } from 'next-auth';

export const config = {
  trustHost: true,
  basePath: '/auth',
  callbacks: {
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const whitelist = ['/login', '/signup', '/forgot-password'];
      const isNotOnWhitelist = !whitelist.includes(nextUrl.pathname);
      if (isNotOnWhitelist) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        const callbackUrl = nextUrl.searchParams.get('callbackUrl');
        return Response.redirect(new URL(callbackUrl || '/', nextUrl));
      }
      return true;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid as string;
      }
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

export default config;
