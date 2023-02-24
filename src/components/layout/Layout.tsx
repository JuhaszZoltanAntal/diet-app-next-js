import React from 'react';
import { useSession } from 'next-auth/react';
import NavBar from './NavBar';
import Footer from './Footer';
import LoginForm from '../auth/LoginForm';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <NavBar userName={session.user.name + session.user.id} session={session} />
        {children}
        <Footer />
      </>

    );
  } else {
    return <LoginForm />;
  }
}
