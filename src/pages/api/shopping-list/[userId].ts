import type { NextApiHandler } from 'next';
import { conncetMongo } from '@/mongo/connect';
import User from '@/mongo/models/userModel';
import { Unit } from '@/mongo/models/enums';
import { IIngredient } from '@/mongo/models/ingredientModel';
import { IDiet } from '@/mongo/models/dietModel';
import { IMeal } from '@/mongo/models/mealModel';
import { IDailyMeals } from '@/mongo/models/dailyMealsModel';

import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

let handler: NextApiHandler<any> = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).send({
      message: 'You must be logged in.',
    });
    return;
  }
  
  await conncetMongo();

  if (req.method === 'POST') {

    const checkboxValues = req.body.checkboxValues;

    const user = await User.findOne({ id: req.query.userId });

    const selectedDiets = user.diets.filter((diet: IDiet, index: number) => checkboxValues[index] === true);
    const selectedDailyMelasList = selectedDiets.flat().map(({ dailyMelasList }: {dailyMelasList: IDailyMeals[]}) => dailyMelasList);
    const selectedMealsList = selectedDailyMelasList.flat().map(({ mealsList }: {mealsList: IMeal[]}) => mealsList);
    const selectedIngredients = selectedMealsList.flat().map(({ ingredients }: {ingredients: IIngredient[]}) => ingredients);
    const selectedIngredientsFlattened = selectedIngredients.flat();

    const standardizedIngredients: IIngredient[] = [];
    selectedIngredientsFlattened.forEach((ingredient: IIngredient) => {
      let multiplier;
      let newUnit;
      switch (ingredient.unit) {
        case Unit.dkg:
          multiplier = 10;
          newUnit = Unit.g;
          break;
        case Unit.dl:
          multiplier = 100;
          newUnit = Unit.ml;
          break;
        case Unit.kg:
          multiplier = 1000;
          newUnit = Unit.g;
          break;
        case Unit.l:
          multiplier = 1000;
          newUnit = Unit.ml;
          break;
        default:
          multiplier = 1;
          newUnit = ingredient.unit;
          break;
      }

      ingredient.amount = ingredient.amount! * multiplier;
      ingredient.unit = newUnit;

      standardizedIngredients.push(ingredient);
    });

    let groupedAndSummedIngredients: IIngredient[] = [];
    standardizedIngredients.reduce((res, value) => {
      if (!(res as any)[value.name]) {
        (res as any)[value.name] = { name: value.name, amount: 0 };
        groupedAndSummedIngredients.push((res as any)[value.name]);
      }
      (res as any)[value.name].amount += value.amount;
      (res as any)[value.name].unit = value.unit;
      return res;
    }, {});

    if (user) {
      const filter = { id: req.query.userId };
      const update = { $push: { shoppingList: groupedAndSummedIngredients } };
      let doc = await User.findOneAndUpdate(filter, update);

      res.status(200).json({
        message: 'Shopping List successfully added.',
        newShoppingList: groupedAndSummedIngredients,
      });
    } else {
      res.status(500).send({
        message: 'Something went wrong.',
      });
    }
  }
};

export default handler;
