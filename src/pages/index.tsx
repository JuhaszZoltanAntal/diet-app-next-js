import { useContext } from 'react';
import UserContext from '@/store/user-context';
import router from 'next/router';

export default function Home() {
  const { diets, deleteDiet } = useContext(UserContext);

  return diets && diets.length > 0 ? (
    <ul>
      {diets.map((diet) => (
        <li key={diet.name}>
          <b>{diet.name}</b>
          <button onClick={()=>deleteDiet(diet.name)}>Delete</button>
          <p>{JSON.stringify(diet)}</p>
        </li>
      ))}
    </ul>
  ) : (
    <div>
      <p>You dont have any diet yet, please generate one.</p>
      <button onClick={() => router.push('/generate-diet')}>Generate a new diet</button>
    </div>
  );
}
