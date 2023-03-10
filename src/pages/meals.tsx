import React, { useContext } from 'react';
import UserContext from '@/store/user-context';

export default function Meals() {
  const { meals } = useContext(UserContext);
  return (
    <ul>
      {meals?.map((meal) => (
        <li key={meal.name}>{meal.name}</li>
      ))}
    </ul>
  );
}
