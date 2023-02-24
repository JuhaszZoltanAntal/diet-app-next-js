import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();

  console.log(session);

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
    return (
      <div>
        <p>You are not signed in.</p>
        <button
          onClick={() => {
            signIn();
          }}
        >
          Sign in
        </button>
        <button
          onClick={() => {
            router.push('/auth/register');
          }}
        >
          Register
        </button>
      </div>
    );
  }
};

export default Login;
