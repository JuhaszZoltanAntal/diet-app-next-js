import React from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

const LoginForm = () => {
  const router = useRouter();

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
};

export default LoginForm;
