import { IDiet } from '@/mongo/models/dietModel';
import { IIngredient } from '@/mongo/models/ingredientModel';
import { IMeal } from '@/mongo/models/mealModel';
import { createContext, useState } from 'react';

type UserContexType = {
  diets: IDiet[];
  meals: IMeal[];
  ingredients: IIngredient[];
  init: (diets: IDiet[], meals: IMeal[], ingredients: IIngredient[]) => void;
  addMeal: (newMeal: IMeal) => void;
};

const defaultState = {
  diets: [],
  meals: [],
  ingredients: [],
  init: (diets: IDiet[], meals: IMeal[], ingredients: IIngredient[]) => {},
  addMeal: (newMeal: IMeal) => {},
};

const UserContext = createContext<UserContexType>(defaultState);

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [diets, setDiets] = useState<IDiet[]>([]);
  const [meals, setMeals] = useState<IMeal[]>([]);
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);

  function initHandler(diets: IDiet[], meals: IMeal[], ingredients: IIngredient[]) {
   
   
    console.log('initHandler runinng');

    setDiets(() => {
      return diets;
    });

    setMeals(() => {
      return meals;
    });

    setIngredients(() => {
      return ingredients;
    });
  }

  function addMealHandler(newMeal: IMeal) {
    setMeals((preveousMeals) => {
      if (preveousMeals) {
        return { ...preveousMeals, newMeal };
      } else {
        return [];
      }
    });
  }

  const context = {
    diets: diets,
    meals: meals,
    ingredients: ingredients,
    init: initHandler,
    addMeal: addMealHandler,
  };

  return <UserContext.Provider value={context}>{children}</UserContext.Provider>;
}

export default UserContext;
