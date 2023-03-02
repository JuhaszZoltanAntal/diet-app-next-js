import { model, Schema, models } from 'mongoose';
import { IDailyMeals } from './dailyMealsModel';

export interface IDiet {
  name: string;
  expectedCaloriesPerDay: number;
  mealsPerDay: number;
  dailyMelasList: IDailyMeals[];
}

const dietSchema = new Schema<IDiet>({
  name: { type: String, required: true, unique: true },
  expectedCaloriesPerDay: { type: Number, required: true },
  mealsPerDay: { type: Number, required: true },
  dailyMelasList: { type: Schema.Types.Mixed, required: true },
});

const Diet = models.Diet || model<IDiet>('Diet', dietSchema);

export default Diet;
