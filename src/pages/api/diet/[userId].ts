import type { NextApiHandler } from 'next';
import { conncetMongo } from '@/mongo/connect';
import User, { IUser } from '@/mongo/models/userModel';
import { IDiet } from '@/mongo/models/dietModel';
import { IDailyMeals } from '@/mongo/models/dailyMealsModel';
import { MealType } from '@/mongo/models/enums';
import { IMeal } from '@/mongo/models/mealModel';

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
    const data = {
      name: req.body.name,
      expectedCaloriesPerDay: req.body.expectedCaloriesPerDay,
      mealsPerDay: req.body.mealsPerDay,
    };

    const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

    const generateDailyMealsList = (mealsPerDay: number, user: IUser): IDailyMeals[] => {
      let dailyMelasList: IDailyMeals[] = [];

      const breakfasts: IMeal[] = user!.meals!.filter((m: IMeal) =>
        m.mealtypes.includes(MealType.breakfest)
      );
      const lunches: IMeal[] = user!.meals!.filter((m: IMeal) =>
        m.mealtypes.includes(MealType.lunch)
      );
      const others: IMeal[] = user!.meals!.filter((m: IMeal) =>
        m.mealtypes.includes(MealType.other)
      );
      const dinners: IMeal[] = user!.meals!.filter((m: IMeal) =>
        m.mealtypes.includes(MealType.dinner)
      );

      let positonOfLunch;

      switch (mealsPerDay) {
        case 5 || 6:
          positonOfLunch = 3;
          break;
        case 7 || 8:
          positonOfLunch = 4;
          break;
        default:
          positonOfLunch = 2;
          break;
      }

      for (let index = 0; index < 7; index++) {
        let mealsList: IMeal[] = [];

        for (let index = 0; index < mealsPerDay - 1; index++) {
          if (index === 0) {
            mealsList.push(getRandomElement(breakfasts));
          }
          if (index === positonOfLunch) {
            mealsList.push(getRandomElement(lunches));
          }
          if (index === mealsPerDay - 1) {
            mealsList.push(getRandomElement(dinners));
          } else {
            mealsList.push(getRandomElement(others));
          }
        }

        let oneDayMeals: IDailyMeals = {
          numberOftheMealsPerDay: mealsPerDay,
          mealsList: mealsList,
        };

        dailyMelasList.push(oneDayMeals);
      }

      return dailyMelasList;
    };
    const user = await User.findOne({ id: req.query.userId });

    const dailyMealsList = generateDailyMealsList(data.mealsPerDay, user);
    const newDiet: IDiet = {
      ...data,
      dailyMelasList: dailyMealsList,
    };

    const hasDiet = await User.findOne({
      id: req.query.userId,
      diets: { $elemMatch: { name: newDiet.name } },
    });

    if (user && !hasDiet) {
      const filter = { id: req.query.userId };
      const update = { $push: { diets: newDiet } };
      let doc = await User.findOneAndUpdate(filter, update);

      res.status(200).json({
        message: 'Diet successfully added.',
        newDiet: newDiet,
      });
    } else {
      res.status(500).send({
        message: 'This diet already exists.',
      });
    }
  }
};

export default handler;
