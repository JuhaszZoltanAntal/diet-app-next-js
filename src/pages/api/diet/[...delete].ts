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

  if (req.method === 'DELETE') {
    const nameOfRemovableDiet = req.query!.delete![0];
    const userId = req.query!.delete![1];

    const user = await User.findOne({ id: userId });

    const hasDiet = await User.findOne({
      id: userId,
      diets: { $elemMatch: { name: nameOfRemovableDiet } },
    });

    if (user && hasDiet) {
      const filter = { id: userId };
      const update = { $pull: { diets: { name: nameOfRemovableDiet } } };
      let doc = await User.updateOne(filter, update);

      res.status(200).json({
        message: 'Diet successfully deleted.',
      });
    } else {
      res.status(500).send({
        message: 'This diet not exists.',
      });
    }
  }
};

export default handler;
