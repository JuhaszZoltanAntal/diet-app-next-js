import { CalorieUnit, MealType, Unit } from '@/mongo/models/enums';
import { IIngredient } from '@/mongo/models/ingredientModel';
import { IMeal } from '@/mongo/models/mealModel';
import UserContext from '@/store/user-context';
import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import Select, { MultiValue } from 'react-select';

export default function NewMeals() {
  const { addMeal, ingredients, meals } = useContext(UserContext);

  const [message, setMessage] = useState<string>('');

  const nameRef = useRef<HTMLInputElement>(null);

  const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([]);
  const [isBreakfast, setIsBreakfast] = useState(false);
  const [isLunch, setIsLunch] = useState(false);
  const [isDinner, setIsDinner] = useState(false);
  const [isOther, setIsOther] = useState(false);

  const [selectedIngredients, setSelectedIngredients] = useState<IIngredient[]>([]);

  const options = ingredients.map((ingredient) => {
    return { value: ingredient.name, label: ingredient.name };
  });

  const [selectedOptions, setSelectedOptions] =
    useState<MultiValue<{ value: string; label: string } | undefined>>();

  function handleSelect(
    selectedOptionsList: MultiValue<{ value: string; label: string } | undefined>
  ) {
    setSelectedOptions(selectedOptionsList);

    if (selectedOptionsList.length > 0) {
      let result: IIngredient[] = [];
      for (let i = 0; i < selectedOptionsList.length; i++) {
        for (let y = 0; y < ingredients.length; y++) {
          if (selectedOptionsList[i]?.label === ingredients[y].name)
            result.push({
              name: ingredients[y].name,
              amount: 1,
              unit: ingredients[y].unit,
              calorie: ingredients[y].calorie,
              calorieUnit: ingredients[y].calorieUnit,
            });
        }
      }
      setSelectedIngredients(result);
    }
  }

  function CalorieCalculator(listOfIngredients: IIngredient[]) {
    let sumMeal = 0;

    listOfIngredients.forEach((ingredient) => {
      let multiplier = 1;
      let divider = 100;

      let sumIngredient = 0;

      switch (ingredient.unit) {
        case Unit.dkg:
          multiplier = 10;
          break;
        case Unit.dl:
          multiplier = 100;
          break;
        case Unit.kg || Unit.l:
          multiplier = 1000;
          break;
        case Unit.piece:
          divider = 1;
          break;
        default:
          multiplier = 1;
          break;
      }
      if (ingredient.amount && ingredient.amount > 0)
        sumIngredient = (ingredient.amount * ingredient.calorie * multiplier) / divider;

      sumMeal += sumIngredient;
    });
    return sumMeal;
  }

  const handleAddMeal = (e: FormEvent) => {
    e.preventDefault();

    const enteredName: string = nameRef.current!.value;

    if ((selectedMealTypes.length > 0, selectedIngredients.length > 0)) {
      const newMeal: IMeal = {
        name: enteredName,
        calorie: CalorieCalculator(selectedIngredients),
        ingredients: selectedIngredients,
        mealtypes: selectedMealTypes,
      };
      if (!(meals.filter((m) => m.name === newMeal.name).length > 0)) addMeal(newMeal);
      setMessage('Meal Added ' + JSON.stringify(newMeal, null, '\t'));
    } else {
      setMessage('Someghing missing! (At least one meal type should be selected)');
    }
  };

  useEffect(() => {
    setSelectedMealTypes(() => {
      let finalState: MealType[] = [];
      if (isBreakfast) {
        finalState.push(MealType.breakfest);
      }
      if (isLunch) {
        finalState.push(MealType.lunch);
      }
      if (isDinner) {
        finalState.push(MealType.dinner);
      }
      if (isOther) {
        finalState.push(MealType.other);
      }

      return finalState;
    });
  }, [isDinner, isBreakfast, isOther, isLunch]);

  function renderSelect(ingredient: IIngredient) {
    let array;
    switch (ingredient.calorieUnit) {
      case CalorieUnit.piece:
        array = [Unit.piece];
        break;
      case CalorieUnit.kcalg:
        array = [Unit.g, Unit.dkg, Unit.kg];
        break;
      default:
        array = [Unit.ml, Unit.dl, Unit.l];
        break;
    }
    return array.map((unit) => (
      <option key={unit} value={unit}>
        {Unit[unit]}
      </option>
    ));
  }

  return (
    <form onSubmit={handleAddMeal}>
      <div>
        <div>
          <label htmlFor='name'>Name of the meal</label>
          <input ref={nameRef} type='text' id='name' required />
        </div>

        <div>
          <label htmlFor='breakfast'>
            <input
              id='breakfast'
              type='checkbox'
              onChange={() => setIsBreakfast((prevState) => !prevState)}
              checked={isBreakfast}
            />
            Breakfast
          </label>
          <label htmlFor='lunch'>
            <input
              id='lunch'
              type='checkbox'
              onChange={() => setIsLunch((prevState) => !prevState)}
              checked={isLunch}
            />
            Lunch
          </label>
          <label htmlFor='dinner'>
            <input
              id='dinner'
              type='checkbox'
              onChange={() => setIsDinner((prevState) => !prevState)}
              checked={isDinner}
            />
            Dinner
          </label>
          <label htmlFor='other'>
            <input
              id='other'
              type='checkbox'
              onChange={() => setIsOther((prevState) => !prevState)}
              checked={isOther}
            />
            Other
          </label>
        </div>

        <div>
          <label htmlFor=''>Select ingredients</label>
          <Select
            options={options}
            placeholder='Select Ingredients'
            value={selectedOptions}
            onChange={handleSelect}
            isSearchable={true}
            isMulti
          />
        </div>

        {selectedIngredients?.map((ingredient, index) => {
          return (
            <div key={ingredient?.name}>
              <p>
                {ingredient?.name} {ingredient?.amount} {ingredient?.unit} {ingredient?.calorie}
                {ingredient?.calorieUnit}
              </p>
              <div>
                <label htmlFor={ingredient?.name + 'amaunt'}>Amunt</label>
                <input
                  id={ingredient?.name + 'amaunt'}
                  type='number'
                  step='0.1'
                  min='0.1'
                  required
                  value={selectedIngredients[index].amount}
                  onChange={(e) => {
                    setSelectedIngredients((prevState) => {
                      let newArray = [...prevState];
                      let tempIngredient = { ...newArray[index] };
                      tempIngredient.amount = +e.target.value;
                      newArray[index] = tempIngredient;
                      return newArray;
                    });
                  }}
                />
              </div>

              <div>
                <label htmlFor={ingredient?.name + 'unit'}>Unit</label>
                <select
                  id={ingredient?.name + 'unit'}
                  required
                  value={selectedIngredients[index].unit}
                  onChange={(e) => {
                    setSelectedIngredients((prevState) => {
                      let newArray = [...prevState];
                      let tempIngredient = { ...newArray[index] };
                      tempIngredient.unit = Unit[e.target.value as keyof typeof Unit];
                      newArray[index] = tempIngredient;
                      return newArray;
                    });
                  }}
                >
                  {renderSelect(selectedIngredients[index])}
                </select>
              </div>
            </div>
          );
        })}

        <button type='submit'>Add Meal</button>

        {message && <p>{message}</p>}
      </div>
    </form>
  );
}
