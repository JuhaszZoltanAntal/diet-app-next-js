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

  if (req.method === 'GET') {
    const userId = req.query.userId;
    const user = await User.findOne({ id: userId });
    if (user) {
      res.status(200).json({
        meals: user.meals,
        ingredients: user.ingredients,
        diets: user.diets,
      });
    } else {
      res.status(500).send({ message: 'Something went wrong.' });
    }
  }
};

export default handler;
