import prisma from './lib/prisma';
import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';

export const config = {
  theme: {
    logo: '/next.svg',
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Sign in',
      id: 'signin',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('credentials', credentials);
        const { username, password } = credentials as { username: string; password: string };

        const user = await prisma.user.findFirst({
          where: {
            name: username,
            password,
          },
        });

        console.log('user', user);

        return {
          name: username,
        };
      },
    }),
    CredentialsProvider({
      name: 'Sign up',
      id: 'signup',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        confirmPassword: { label: 'Confirm Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('signup', credentials);
        const { username, password, confirmPassword } = credentials as {
          username: string;
          password: string;
          confirmPassword: string;
        };

        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }

        const user = await prisma.user.findFirst({
          where: {
            name: username,
            password,
          },
        });

        if (!user) {
          return await prisma.user.create({
            data: {
              name: username,
              password,
            },
          });
        }

        return null;
      },
    }),
    GitHub,
  ],
  trustHost: true,
  basePath: '/auth',
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname === '/dashboard') return !!auth;
      return true;
    },
    session({ session }) {
      // console.log('session', { session, token });
      // if (token.sub) session.user.id = token.sub;
      return session;
    },
    jwt({ token, trigger, session }) {
      if (trigger === 'update') token.name = session.user.name;
      return token;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
  },
} satisfies NextAuthConfig;

export default config;
