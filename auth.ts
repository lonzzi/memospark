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
            // username: z.string().min(3),
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
      id: 'logout',
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
});
