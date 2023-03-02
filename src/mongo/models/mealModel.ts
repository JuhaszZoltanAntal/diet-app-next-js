import { model, Schema, models } from 'mongoose';
import { MealTypes } from './enums';
import { IIngredient } from './ingredientModel';

export interface IMeal {
  name: string;
  calorie: number;
  mealtypes: MealTypes[];
  ingredients: IIngredient[];
}

const mealSchema = new Schema<IMeal>({
  name: { type: String, required: true, unique: true },
  calorie: { type: Number, required: true },
  mealtypes: { type: Schema.Types.Mixed, required: true },
  ingredients: { type: Schema.Types.Mixed, required: true },
});

const Meal = models.Meal || model<IMeal>('Meal', mealSchema);

export default Meal;
