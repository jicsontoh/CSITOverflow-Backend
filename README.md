# CSITOverflow-Backend

This is the backend code repository for my [CSITOverflow App](https://github.com/jicsontoh/CSITOverflow-Frontend).
This is built using node.js, express.js and mongoDB.

## How to Install

1. Set up env variables

Create a .env with the following variables

```
MONGO_URL="mongodb+srv://..."
PRIV_KEY=""
```

2. Install node modules

```
$ npm i
```

3. Start using the server!

```
$ npm start
```

If you wish to Dockerise the application, you can apply the following command to create an image

```
$ docker build -t csit-overflow-backend .
```

Do remember to set the env variables
