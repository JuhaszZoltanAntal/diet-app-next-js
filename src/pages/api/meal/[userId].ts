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
    const newMeal = {
      name: req.body.name,
      calorie: req.body.calorie,
      mealtypes: req.body.mealtypes,
      ingredients: req.body.ingredients,
    };

    const user = await User.findOne({ id: req.query.userId });

    const hasMeal = await User.findOne({
      id: req.query.userId,
      meals: { $elemMatch: { name: newMeal.name } },
    });

    if (user && !hasMeal) {
      const filter = { id: req.query.userId };
      const update = { $push: { meals: newMeal } };
      let doc = await User.findOneAndUpdate(filter, update);

      res.status(200).json({
        message: 'Meal successfully added.',
        newMeal: { name: newMeal.name },
      });
    } else {
      res.status(500).send({
        message: 'This meal already exists.',
      });
    }
  }
};

export default handler;
