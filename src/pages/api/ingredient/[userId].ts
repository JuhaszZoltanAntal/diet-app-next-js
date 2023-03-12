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
    const newIngredient = {
      name: req.body.name,
      unit: req.body.unit,
      calorie: req.body.calorie,
      calorieUnit: req.body.calorieUnit,
    };

    const user = await User.findOne({ id: req.query.userId });

    const hasIngredient = await User.findOne({
      id: req.query.userId,
      ingredients: { $elemMatch: { name: newIngredient.name } },
    });

    if (user && !hasIngredient) {
      const filter = { id: req.query.userId };
      const update = { $push: { ingredients: newIngredient } };
      let doc = await User.findOneAndUpdate(filter, update);

      res.status(200).json({
        message: 'Ingredient successfully added.',
        newIngredient: { name: newIngredient.name },
      });
    } else {
      res.status(500).send({
        message: 'This ingredient already exists.',
      });
    }
  }
};

export default handler;
