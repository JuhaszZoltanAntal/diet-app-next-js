import React, { useContext, useEffect, useState } from 'react';
import UserContext from '@/store/user-context';
import { IIngredient } from '@/mongo/models/ingredientModel';
import { Unit } from '@/mongo/models/enums';

export default function ShoppingList() {
  const { diets, shoppingList, setShoppingList } = useContext(UserContext);

  const [checkboxValues, setCheckboxValues] = useState<boolean[]>([]);

  useEffect(() => {
    if (diets) {
      let newCheckboxValues: boolean[] = [];
      for (let index = 0; index < diets.length; index++) {
        setCheckboxValues((prevCheckboxValues) => {
          if (index === 0) {
            newCheckboxValues.push(true);
          } else {
            newCheckboxValues.push(false);
          }
          return newCheckboxValues;
        });
      }
    }
  }, [diets]);

  useEffect(() => {
    setShoppingList(checkboxValues);
  }, [checkboxValues]);

  const checkboxList = () => {
    if (diets)
      return diets.map((diet, index) => (
        <label key={diet.name} htmlFor={diet.name}>
          <input
            id={diet.name}
            type='checkbox'
            onChange={() =>
              setCheckboxValues((prevState) => {
                prevState[index] = !prevState[index];
                return [...prevState];
              })
            }
            checked={checkboxValues[index] || false}
          />
          {diet.name}
        </label>
      ));
  };

  const ingredientsList = () => {
    if (shoppingList && shoppingList.length > 0) {
      return (
        <ul>
          {shoppingList.map((ingredient) => (
            <li key={ingredient.name}>
              <b>{ingredient.name}</b>
              <p>{ingredient.amount}</p>
              <p>{ingredient.unit}</p>
            </li>
          ))}
        </ul>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      <div>{checkboxList()}</div>
      <div>{ingredientsList()}</div>
    </div>
  );
}
