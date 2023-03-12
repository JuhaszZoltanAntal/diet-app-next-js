import type { NextApiHandler } from 'next';
import { conncetMongo } from '@/mongo/connect';
import User from '@/mongo/models/userModel';

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
    let userId;
    let startingIngredients;
    let startingMeals;
    if (req.body.userId) {
      userId = req.body.userId;
    } else {
      res.status(500).send({ message: 'Somthing went wrong. (userId missing)' });
    }
    if (req.body.startingIngredients) {
      startingIngredients = req.body.startingIngredients;
    } else {
      res.status(500).send({ message: 'Somthing went wrong. (startingIngredients missing)' });
    }
    if (req.body.startingMeals) {
      startingMeals = req.body.startingMeals;
    } else {
      res.status(500).send({ message: 'Somthing went wrong. (startingMeals missing)' });
    }

    const isInitiated = await User.findOne({
      id: userId,
      meals: { $exists: true },
      ingredients: { $exists: true },
    });

    if (userId && startingIngredients && startingMeals && !isInitiated) {
      const filter = { id: userId };
      const update = {
        $push: { meals: { $each: startingMeals }, ingredients: { $each: startingIngredients } },
      };
      let doc = await User.findOneAndUpdate(filter, update);
      res.status(200).json({
        message: 'Success!',
      });
    } else {
      res.status(500).json({
        message: 'Already initiated!',
      });
    }
  }
};

export default handler;
