import LoginForm from '@/components/auth/LoginForm';
import { useSession, signOut } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <p>Welcome, {session.user?.name}</p>
        <p>User_id: {session.user?.id}</p>
        <button
          onClick={() => {
            signOut();
          }}
        >
          Sign out
        </button>
      </div>
    );
  } else {
    return <LoginForm />;
  }
}
