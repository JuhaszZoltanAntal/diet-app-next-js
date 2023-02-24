import { model, Schema, models } from 'mongoose';
import { IMeals } from './mealModel';

export interface IDailyMeals {
  numberOftheMealsPerDay: number;
  mealsList: IMeals[];
}

const dailyMealsSchema = new Schema<IDailyMeals>({
  numberOftheMealsPerDay: { type: Number, required: true },
  mealsList: { type: Schema.Types.Mixed, required: true },
});

const DailyMeals = models.DailyMeals || model<IDailyMeals>('DailyMeals', dailyMealsSchema);

export default DailyMeals;
