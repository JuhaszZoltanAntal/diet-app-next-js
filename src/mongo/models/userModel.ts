import { model, Schema, models } from 'mongoose';
import { IDiet } from './dietModel';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  diet?: IDiet[];
}

const userSchema = new Schema<IUser>({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
  diet: { type: Schema.Types.Mixed },
});

const User = models.User || model<IUser>('User', userSchema);

export default User;
