import { IDiet } from '@/mongo/models/dietModel';
import { IIngredient } from '@/mongo/models/ingredientModel';
import { IMeal } from '@/mongo/models/mealModel';
import STARTING_DATA from '@/mongo/starting-data';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { createContext, useState, useEffect } from 'react';

type UserContexType = {
  diets: IDiet[];
  meals: IMeal[];
  ingredients: IIngredient[];
  addMeal: (newMeal: IMeal) => void;
  addIngredient: (newIngredient: IIngredient) => void;
  generateDiet: (data: {
    name: string;
    expectedCaloriesPerDay: number;
    mealsPerDay: number;
  }) => void;
};

const defaultState = {
  diets: [],
  meals: [],
  ingredients: [],
  addMeal: (newMeal: IMeal) => {},
  addIngredient: (newIngredient: IIngredient) => {},
  generateDiet: (data: { name: string; expectedCaloriesPerDay: number; mealsPerDay: number }) => {},
};

const UserContext = createContext<UserContexType>(defaultState);

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  const [diets, setDiets] = useState<IDiet[]>([]);
  const [meals, setMeals] = useState<IMeal[]>([]);
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);

  function addMealHandler(newMeal: IMeal) {
    axios
      .post(
        '/api/meal/' + session?.user.id,
        {
          ...newMeal,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then(function (response) {
        console.log(response);
        setMeals((preveousMeals) => {
          if (preveousMeals) {
            return [...preveousMeals, newMeal];
          } else {
            return [];
          }
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function addIngredientHandler(newIngredient: IIngredient) {
    axios
      .post(
        '/api/ingredient/' + session?.user.id,
        {
          ...newIngredient,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then(function (response) {
        console.log(response);
        setIngredients((preveousIngredients) => {
          if (preveousIngredients) {
            return [...preveousIngredients, newIngredient];
          } else {
            return [];
          }
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function generateDietHandler(data: {
    name: string;
    expectedCaloriesPerDay: number;
    mealsPerDay: number;
  }) {
    axios
      .post(
        '/api/diet/' + session?.user.id,
        {
          ...data,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then(function (response) {
        console.log(response);
        setDiets((prevDiets) => {
          let newDiet = prevDiets;
          newDiet.push(response.data.newDiet);
          return newDiet;
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const context = {
    diets: diets,
    meals: meals,
    ingredients: ingredients,
    addMeal: addMealHandler,
    addIngredient: addIngredientHandler,
    generateDiet: generateDietHandler,
  };

  useEffect(() => {
    if (session) {
      (async () => {
        //create user in the database if signed in with google oauth
        await axios
          .post(
            '/api/user',
            {
              name: session.user.name,
              email: session.user.email,
              id: session.user.id,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });

        //add starting meals and ingredients (this could be set in the database but I want to allow others to set the app locally)
        await axios
          .post(
            '/api/init',
            {
              userId: session.user.id,
              ...STARTING_DATA,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });

        //initialize app level data
        await axios
          .get('/api/init/' + session.user.id)
          .then(function (response) {
            console.log(response);
            setMeals(response.data.meals);
            setDiets(response.data.diets);
            setIngredients(response.data.ingredients);
          })
          .catch(function (error) {
            console.log(error);
          });
      })();
    }
  }, [session]);

  return <UserContext.Provider value={context}>{children}</UserContext.Provider>;
}

export default UserContext;
