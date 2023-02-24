import type { NextApiHandler } from 'next';
import User, { IUser } from '@/mongo/models/userModel';
import crypto from 'crypto';
import { conncetMongo } from '@/mongo/connect';

let handler: NextApiHandler<any> = async (req, res) => {
  await conncetMongo();

  if (req.method === 'POST') {
    const newUser = {
      id: crypto.randomUUID().toString(),
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    const userAlreadyExists = await User.findOne({ email: newUser.email });

    if (!userAlreadyExists) {
      const userDocument = new User({
        ...newUser,
      });

      await userDocument.save();

      res.status(200).json({
        message: 'Success!',
        newUser: { name: newUser.name, email: newUser.email },
      });
    } else {
      res.status(500).send({ message: 'This email is already used!' });
    }
  }
};

export default handler;
