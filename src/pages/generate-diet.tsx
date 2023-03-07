import UserContext from '@/store/user-context';
import React, { FormEvent, useContext, useRef, useState } from 'react';

export default function GenerateDiet() {
  const { generateDiet, diets } = useContext(UserContext);

  const [message, setMessage] = useState<string>('');

  const nameRef = useRef<HTMLInputElement>(null);
  const expectedCaloriesPerDayRef = useRef<HTMLInputElement>(null);
  const mealsPerDayRef = useRef<HTMLInputElement>(null);

  const handleGenerateDiet = (e: FormEvent) => {
    e.preventDefault();

    const enteredName: string = nameRef.current!.value;
    const enteredExpectedCaloriesPerDay: number = +expectedCaloriesPerDayRef.current!.value;
    const enteredMealsPerDay: number = +mealsPerDayRef.current!.value;

    if (enteredName && enteredExpectedCaloriesPerDay && enteredMealsPerDay) {
      const data: { name: string; expectedCaloriesPerDay: number; mealsPerDay: number } = {
        name: enteredName,
        expectedCaloriesPerDay: enteredExpectedCaloriesPerDay,
        mealsPerDay: enteredMealsPerDay,
      };
      if (!diets || !(diets.filter((d) => d.name === data.name).length > 0)) generateDiet(data);
      setMessage('Diet Generated: ' + JSON.stringify(data, null, '\t'));
    } else {
      setMessage('Someghing missing!');
    }
  };

  return (
    <form onSubmit={handleGenerateDiet}>
      <div>
        <div>
          <label htmlFor='name'>Name of the Diet</label>
          <input ref={nameRef} type='text' id='name' required />
        </div>

        <div>
          <label htmlFor='caloriesPerDay'>Expected Calories Per Day</label>
          <input
            ref={expectedCaloriesPerDayRef}
            type='number'
            id='caloriesPerDay'
            defaultValue='2000'
            required
            step='1'
            min='500'
            max='10000'
          />
        </div>

        <div>
          <label htmlFor='meals'>Meals Per Day</label>
          <input
            ref={mealsPerDayRef}
            type='number'
            id='meals'
            defaultValue='3'
            required
            step='1'
            min='3'
            max='6'
          />
        </div>

        <button type='submit'>Generate Diet</button>

        {message && <p>{message}</p>}
      </div>
    </form>
  );
}
