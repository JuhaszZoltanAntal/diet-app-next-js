import type { NextApiHandler } from 'next';
import { conncetMongo } from '@/mongo/connect';
import User from '@/mongo/models/userModel';

let handler: NextApiHandler<any> = async (req, res) => {
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

    if (userId && startingIngredients && startingMeals) {
      const filter = { id: userId };
      const update = { meals: [...startingMeals], ingredients: [...startingIngredients] };
      let doc = await User.findOneAndUpdate(filter, update);
      res.status(200).json({
        message: 'Success!',
      });
    }
  }
};

export default handler;
