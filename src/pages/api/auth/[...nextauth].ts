import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { conncetMongo } from '@/mongo/connect';
import User from '@/mongo/models/userModel';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'email',
      credentials: {
        email: {
          label: 'E-mail',
          type: 'email',
          placeholder: 'example@mail.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        await conncetMongo();
        const searchedUser = await User.findOne({ email: credentials.email });
        if (searchedUser) {
          if (
            credentials.email === searchedUser.email &&
            credentials.password === searchedUser.password
          ) {
            return {
              id: searchedUser.id,
              name: searchedUser.name,
              email: searchedUser.email,
            };
          }
        }
        //login failed
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  theme: {
    colorScheme: 'light',
  },
  secret: process.env.JWT_SECRET,
  debug: true,
  callbacks: {
    async jwt({ token, user }: any) {
      if (user?._id) token._id = user._id;
      return token;
    },
    async session({ session, token, user }: any) {
      // user id is stored in .id when using credentials provider
      if (token?._id) session.user.id = token._id;

      // user id is stored in .id when using google provider
      if (token?.sub) session.user.id = token.sub;

      return session;
    },
  },
};

export default NextAuth(authOptions);
