import React, { useContext } from 'react';
import UserContext from '@/store/user-context';

export default function Ingredients() {
  const { ingredients, deleteIngredient } = useContext(UserContext);

  return (
    <ul>
      {ingredients?.map((ingredient) => (
        <li key={ingredient.name}>{ingredient.name}
        <button onClick={()=>deleteIngredient(ingredient.name)}>Delete</button></li>
      ))}
    </ul>
  );
}
