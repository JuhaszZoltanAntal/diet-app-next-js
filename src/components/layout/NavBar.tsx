import React from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';

export default function NavBar({ userName, session }: { userName: string; session: Session }) {
  return (
    <div>
      <div>
        <p>Welcome, {userName}</p>
        <button
          onClick={() => {
            signOut();
          }}
        >
          Sign out
        </button>
      </div>
      <ul>
        <li>
          <Link href='/'>Diet</Link>
        </li>
        <li>
          <Link href='/generate-diet'>Generate new diet</Link>
        </li>
        <li>
          <Link href='meals'>Meals</Link>
        </li>
        <li>
          <Link href='new-meals'>Add new meals</Link>
        </li>
        <li>
          <Link href='shopping-list'>Shopping List</Link>
        </li>
      </ul>
    </div>
  );
}
