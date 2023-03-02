import { model, Schema, models } from 'mongoose';
import { IDiet } from './dietModel';
import { IIngredient } from './ingredientModel';
import { IMeal } from './mealModel';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  diets?: IDiet[];
  meals?: IMeal[];
  ingredients?: IIngredient[];
}

const userSchema = new Schema<IUser>({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
  diets: { type: Schema.Types.Mixed },
  meals: { type: Schema.Types.Mixed },
  ingredients: { type: Schema.Types.Mixed },
});

const User = models.User || model<IUser>('User', userSchema);

export default User;
