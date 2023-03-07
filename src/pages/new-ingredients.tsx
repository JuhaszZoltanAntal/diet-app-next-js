import { CalorieUnit, Unit } from '@/mongo/models/enums';
import Ingredient, { IIngredient } from '@/mongo/models/ingredientModel';
import UserContext from '@/store/user-context';
import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react';

export default function NewIngredient() {
  const { addIngredient, ingredients } = useContext(UserContext);

  const [message, setMessage] = useState<string>('');

  const nameRef = useRef<HTMLInputElement>(null);
  const calorieRef = useRef<HTMLInputElement>(null);

  const [selectedUnit, setSelectedUnit] = useState<Unit>(Unit.g);
  const [selectedCalorieUnit, setSelectedCalorieUnit] = useState<CalorieUnit>(CalorieUnit.kcalg);

  const handleAddIngredient = (e: FormEvent) => {
    e.preventDefault();

    const enteredName: string = nameRef.current!.value;
    const enteredCalorie: number = +calorieRef.current!.value;

    if (enteredName && enteredCalorie) {
      const newIngredient: IIngredient = {
        name: enteredName,
        unit: selectedUnit,
        calorie: enteredCalorie,
        calorieUnit: selectedCalorieUnit,
      };
      if (!(ingredients.filter((i) => i.name === newIngredient.name).length > 0))
        addIngredient(newIngredient);
      setMessage('Ingredient Added ' + JSON.stringify(newIngredient, null, '\t'));
    } else {
      setMessage('Someghing missing!');
    }
  };

  useEffect(() => {
    switch (selectedCalorieUnit) {
      case CalorieUnit.piece:
        setSelectedUnit(Unit.piece);
        break;
      case CalorieUnit.kcalg:
        setSelectedUnit(Unit.g);
        break;
      default:
        setSelectedUnit(Unit.ml);
        break;
    }
  }, [selectedCalorieUnit]);

  const getEnumKeys = <T extends Object>(
    enumToDeconstruct: T
  ): Array<keyof typeof enumToDeconstruct> => {
    return Object.keys(enumToDeconstruct) as Array<keyof typeof enumToDeconstruct>;
  };

  return (
    <form onSubmit={handleAddIngredient}>
      <div>
        <div>
          <label htmlFor='name'>Name of the ingredient</label>
          <input ref={nameRef} type='text' id='name' required />
        </div>

        <div>
          <label htmlFor='calorie'>Calorie</label>
          <input ref={calorieRef} type='number' id='calorie' required step='0.1' min='0.1' />
          <label htmlFor='calorie_unit'> </label>
          <select
            id='calorie_unit'
            required
            value={selectedCalorieUnit}
            onChange={(e) =>
              setSelectedCalorieUnit(CalorieUnit[e.target.value as keyof typeof CalorieUnit])
            }
          >
            {getEnumKeys(CalorieUnit).map((key, index) => (
              <option key={index} value={key}>
                {CalorieUnit[key]}
              </option>
            ))}
          </select>
        </div>

        <button type='submit'>Add Ingredient</button>

        {message && <p>{message}</p>}
      </div>
    </form>
  );
}
