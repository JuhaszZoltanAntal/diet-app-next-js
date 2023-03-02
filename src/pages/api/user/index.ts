import type { NextApiHandler } from 'next';
import User, { IUser } from '@/mongo/models/userModel';
import { conncetMongo } from '@/mongo/connect';

let handler: NextApiHandler<any> = async (req, res) => {
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
      res.status(500).send({ message: 'No need to add user because its already exists in the database.' });
    }
  }
};

export default handler;
