import axios from 'axios';
import React, { FormEvent, useRef, useState } from 'react';

export default function Register() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [errorMessage, setErrorMessage] = useState(null);

  const handleRegistration = (e: FormEvent) => {
    e.preventDefault();

    const enteredName: string = nameRef.current!.value;
    const enteredEmail: string = emailRef.current!.value;
    const enteredFPassword: string = passwordRef.current!.value;

    registerNewUser(enteredName, enteredEmail, enteredFPassword);
  };

  const registerNewUser = (name: string, email: string, password: string) => {
    axios
      .post(
        '/api/auth/register',
        {
          name: name,
          email: email,
          password: password,
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
        setErrorMessage(error.response.data.message)
      });
  };

  return (
    <form onSubmit={handleRegistration}>
      <div>
        <div>
          <label htmlFor='name'>Your Name</label>
          <input ref={nameRef} type='text' id='name' required />
        </div>
        <div>
          <label htmlFor='email'>Your Email Adress</label>
          <input ref={emailRef} type='email' id='email' required />
        </div>
        <div>
          <label htmlFor='password'>
            Your Password (minimum lenght 8 character)
          </label>
          <input
            ref={passwordRef}
            type='password'
            id='password'
            minLength={8}
            required
          />
        </div>
        <button type='submit'>Submit</button>
      </div>
      {errorMessage && <p>{errorMessage}</p>}
    </form>
  );
}
