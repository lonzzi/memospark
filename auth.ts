import prisma from './lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcrypt';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import { z } from 'zod';

import authConfig from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  providers: [
    CredentialsProvider({
      id: 'login',
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        console.log('login', parsedCredentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await prisma.user.findFirst({
            where: {
              email,
            },
          });
          if (!user || !user.password) throw new Error('user not found');
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) {
            return user;
          }

          return null;
        }

        return null;
      },
    }),
    CredentialsProvider({
      id: 'signup',
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
            confirmPassword: z.string().min(6),
          })
          .safeParse(credentials);

        console.log('signup', parsedCredentials);

        if (parsedCredentials.success) {
          const { email, password, confirmPassword } = parsedCredentials.data;
          if (password !== confirmPassword) throw new Error('passwords do not match');
          const user = await prisma.user.create({
            data: {
              email,
              name: email,
              password: await bcrypt.hash(password, 10),
            },
          });
          return user;
        }

        return null;
      },
    }),
    GitHub,
  ],
});
