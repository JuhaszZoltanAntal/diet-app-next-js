import { useEffect, useContext } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import STARTING_DATA from '@/mongo/starting-data';
import UserContext from '@/store/user-context';
import router from 'next/router';

export default function Home() {
  const { data: session } = useSession();
  const { init, diets } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      if (session) {
        //create user in the database if signed in with google oauth
        await axios
          .post(
            '/api/user',
            {
              name: session.user.name,
              email: session.user.email,
              id: session.user.id,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });

        //add starting meals and ingredients (this could be set in the database but I want to allow other to set the app locally)
        await axios
          .post(
            '/api/init',
            {
              userId: session.user.id,
              ...STARTING_DATA,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });

        //initialize app level data
        await axios
          .get('/api/init/' + session.user.id)
          .then(function (response) {
            console.log(response);
            init(response.data.diets, response.data.meals, response.data.ingredients);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    })();
  }, []);

  return diets && diets.length > 0 ? (
    <ul>
      {diets.map((diet) => (
        <li key={diet.name}>{diet.name}</li>
      ))}
    </ul>
  ) : (
    <div>
      <p>You dont have any diet yet, please generate one.</p>
      <button onClick={() => router.push('/generate-diet')}>Generate a new diet</button>
    </div>
  );
}
