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
  shoppingList: IIngredient[];
  addMeal: (newMeal: IMeal) => void;
  addIngredient: (newIngredient: IIngredient) => void;
  generateDiet: (data: {
    name: string;
    expectedCaloriesPerDay: number;
    mealsPerDay: number;
  }) => void;
  setShoppingList: (checkboxValues: boolean[]) => void;
  deleteIngredient: (ingredientName: string) => void;
  deleteMeal: (mealName: string) => void;
  deleteDiet: (dietName: string) => void;
};

const defaultState = {
  diets: [],
  meals: [],
  ingredients: [],
  shoppingList: [],
  addMeal: (newMeal: IMeal) => {},
  addIngredient: (newIngredient: IIngredient) => {},
  generateDiet: (data: { name: string; expectedCaloriesPerDay: number; mealsPerDay: number }) => {},
  setShoppingList: (checkboxValues: boolean[]) => {},
  deleteIngredient: (ingredientName: string) => {},
  deleteMeal: (mealName: string) => {},
  deleteDiet: (dietName: string) => {}
};

const UserContext = createContext<UserContexType>(defaultState);

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  const [diets, setDiets] = useState<IDiet[]>([]);
  const [meals, setMeals] = useState<IMeal[]>([]);
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);
  const [shoppingList, setShoppingList] = useState<IIngredient[]>([]);

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
          let newDiet = prevDiets || [];
          newDiet.push(response.data.newDiet);
          return newDiet;
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function setShoppingListHandler(checkboxValues: boolean[]) {
    axios
      .post(
        '/api/shopping-list/' + session?.user.id,
        {
          checkboxValues: checkboxValues,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then(function (response) {
        console.log(response);
        setShoppingList(response.data.newShoppingList);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function deleteIngredientHandler(ingredientName: string) {
    axios
      .delete('/api/ingredient/' + ingredientName + '/' + session?.user.id)
      .then(function (response) {
        console.log(response);
        setIngredients((prevIngredients) => {
          const newIngredient = prevIngredients.filter((i) => i.name !== ingredientName);
          return [...newIngredient];
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

function deleteMealHandler(mealName:string) {
  axios
      .delete('/api/meal/' + mealName + '/' + session?.user.id)
      .then(function (response) {
        console.log(response);
        setMeals((prevMeals) => {
          const newMeals = prevMeals.filter((m) => m.name !== mealName);
          return [...newMeals];
        });
      })
      .catch(function (error) {
        console.log(error);
      });
}

function deleteDietHandler(dietName:string) {
  axios
  .delete('/api/diet/' + dietName + '/' + session?.user.id)
  .then(function (response) {
    console.log(response);
    setDiets((prevDiets) => {
      const newDiets = prevDiets.filter((d) => d.name !== dietName);
      return [...newDiets];
    });
  })
  .catch(function (error) {
    console.log(error);
  });
}

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

  const context = {
    diets: diets,
    meals: meals,
    ingredients: ingredients,
    shoppingList: shoppingList,
    addMeal: addMealHandler,
    addIngredient: addIngredientHandler,
    generateDiet: generateDietHandler,
    setShoppingList: setShoppingListHandler,
    deleteIngredient: deleteIngredientHandler,
    deleteMeal: deleteMealHandler,
    deleteDiet: deleteDietHandler,
  };

  return <UserContext.Provider value={context}>{children}</UserContext.Provider>;
}

export default UserContext;
