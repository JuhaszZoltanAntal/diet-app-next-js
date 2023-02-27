import { model, Schema, models } from 'mongoose';
import { IIngredient } from './ingredientModel';

export enum MealTypes {
  breakfest = 'breakfast',
  lunch = 'lunch',
  dinner = 'dinner',
  other = 'other',
}

export interface IMeals {
  name: string;
  calorie: number;
  Mealtypes: MealTypes[];
  ingredients: IIngredient[];
}

const mealSchema = new Schema<IMeals>({
  name: { type: String, required: true },
  calorie: { type: Number, required: true },
  Mealtypes: { type: Schema.Types.Mixed, required: true },
  ingredients: { type: Schema.Types.Mixed, required: true },
});

const Meal = models.Meal || model<IMeals>('Meal', mealSchema);

export default Meal;
