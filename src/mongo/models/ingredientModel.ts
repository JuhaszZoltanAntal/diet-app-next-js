import { model, Schema, models } from 'mongoose';

export enum Unit {
  g = 'g',
  dkg = 'dkg',
  kg = 'kg',
  ml = 'ml',
  dl = 'dl',
  l = 'l',
  piece = 'piece',
}

export enum CalorieUnit {
  kcalg = 'kcal/100g',
  kcalml = 'kcal/100ml',
  piece = 'piece',
}

export interface IIngredient {
  name: string;
  amount?: number;
  unit?: Unit;
  calorie: number;
  calorieUnit: CalorieUnit;
}

const ingredientSchema = new Schema<IIngredient>({
  name: { type: String, required: true },
  amount: { type: Number },
  unit: { type: Schema.Types.Mixed, default: Unit.g },
  calorie: { type: Number, required: true },
  calorieUnit: { type: Schema.Types.Mixed, required: true, default: CalorieUnit.kcalg },
});

const Ingredient = models.Ingredient || model<IIngredient>('Ingredient', ingredientSchema);

export default Ingredient;
