import { connect } from 'mongoose';

export const conncetMongo = async () => {
  connect(`${process.env.MONGODB_CONNECTION_STRING}`);
};
