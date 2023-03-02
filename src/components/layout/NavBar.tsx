import React from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function NavBar({ userName }: { userName: string }) {
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
          <Link href='ingredients'>Ingredients</Link>
        </li>
        <li>
          <Link href='new-ingredients'>Add new ingredients</Link>
        </li>
        <li>
          <Link href='shopping-list'>Shopping list</Link>
        </li>
      </ul>
    </div>
  );
}
