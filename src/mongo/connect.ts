import { connect, ConnectOptions } from 'mongoose';

export const conncetMongo = async () => {
  connect(`${process.env.MONGODB_CONNECTION_STRING}`, {
    autoIndex: true,
    dbName: 'diet'
  } as ConnectOptions);
};
