import type { NextApiHandler } from 'next';
import User from '@/mongo/models/userModel';
import { conncetMongo } from '@/mongo/connect';

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
    const newUser = {
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
    };

    const userAlreadyExists = await User.findOne({ id: newUser.id });

    if (!userAlreadyExists) {
      const userDocument = new User({
        ...newUser,
      });

      await userDocument.save();

      res.status(200).json({
        message: 'Success!',
        newUser: { name: newUser.name, email: newUser.email, id: newUser.id },
      });
    } else {
      res
        .status(500)
        .send({ message: 'No need to add user because its already exists in the database.' });
    }
  }
};

export default handler;
