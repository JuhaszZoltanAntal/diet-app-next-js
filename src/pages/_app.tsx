import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/router';
import { UserContextProvider } from '@/store/user-context';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  return (
    <SessionProvider session={session}>
      <UserContextProvider>
        {router.pathname !== '/auth/register' ? (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        ) : (
          <Component {...pageProps} />
        )}
      </UserContextProvider>
    </SessionProvider>
  );
}
