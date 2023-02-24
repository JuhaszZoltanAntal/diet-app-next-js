This is a diet app to manage your daily meals, generate and customize your weekly diet.

Tech stack which I use: next.js, mongodb atlas (mongoose ODM), next auth (google oauth + email/password credentials), react context API, jest, axios

To run the project locally run:

npm install 

add a .env file in the root folder with the content like:

```
GOOGLE_CLIENT_ID={your google cloud app client id}
GOOGLE_CLIENT_SECRET={your google cloud app client secret}

NEXTAUTH_URL=http://localhost:3000

MONGODB_CONNECTION_STRING={your mongo db connection string (create any empty cluster on mongodb atlas (or mongodb server) and connect the application to it)}

JWT_SECRET={jwt secret (you can ganarete one in the command line: "openssl rand -base64 32")}
```

