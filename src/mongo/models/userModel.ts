import { model, Schema, models } from 'mongoose';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = models.User || model<IUser>('User', userSchema);

export default User;
