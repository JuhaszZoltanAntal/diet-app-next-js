
import { useEffect } from "react";
import axios from 'axios';
import { useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()


  useEffect(() => {
    if(session){
      axios
      .post(
        '/api/user/user',
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
    }
  }, [])
  


  return <div>Home</div>;
}
