# book-search-engine

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing Guidelines](#contributing-guidelines)
- [Testing](#testing)
- [Authors and Acknowledgements](#authors-and-acknowledgements)


## Description

Refactor an existing google books RESTful API into a grahql API built with apollo server.

## Installation

To get started with this project, implement the following steps:

1. Clone the repo:

```zsh
git clone git@github.com:gina-t/book-search-engine.git

```
2. In 'root' directory, install dependencies:

```zsh
npm install consurrently --save-dev
```

3. In 'server' folder, install dependencies and add nodemonConfig:

```zsh
npm install bcrypt express jsonwebtoken mongoose @apollo/server graphql graphql-tools jwt-decode cors dotenv
npm install @types/bcrypt @types/express @types/graphql @types/jsonwebtoken @types/node @types/jwt-decode @types/dotenv nodemon typescript ts-node --save-dev

"nodemonConfig": {
  "watch": [
    "src"
  ],
  "ext": "ts,json,js",
  "excec": "ts-node src/server.ts"}
```
4. In 'client' folder, install dependencies:

```zsh 
npm install bootstap jwt-decode react react-bootstarp react-dom react-router-dom @apollo/client graphql

npm install @types/jwt-decode @types/react @types/react-dom @types/node eslint vite --save-dev
```

5. In 'client/utils/API.ts', add your Google API key:

```typescript
export const searchGoogleBooks = (query: string) => {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  console.log('Google API Key:', apiKey); // Add this line to check the API key
  if (!apiKey) {
    throw new Error('Google API key is missing');
  }
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`);
};
```
Guide to obtaining a Google API key:

- Navigate to https://console.cloud.google.com/

- Craete a new project

- Enable APIs and Services > Library

- Create credentials

- Restrict your API key

- Add the API key to client/.env file:

```
VITE_GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY_HERE
```

6. Configure TypeScript:

- root/tsconfig.json conatins the base configuration

- server/tsconfig.json extends the root and adds settings specific to the server-side

- client/tsconfig.json extends the root and adds settings specific to the client-side

7. In 'root' directory, create .gitignore file and add:

.env
node_modules

8. In 'root' directory, create .env file and add:

```javascript
MONGODB_URI='mongodb://127.0.0.1:27017/googlebooks'
JWT_SECRET_KEY=''

```
9. In 'server' folder, generate secret token for JWT:

```zsh
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

10. Copy the generated secret token and paste into JWT_SECRET_KEY field in the .env file.

11. In 'server.ts', implement Apollo Server and apply it to the Express server as middleware.

12. To start the dvelopment server, run the following command:

```zsh
npm run develop
```

13. To build the application for production, run the following command:

```zsh
npm run render-build
```
14. To start the application in production, run the following command:

```zsh
npm run start
```

## Usage

Link to render deployment:

[book-search-engine](https://book-search-engine.onrender.com/)

Screenshots of app demonstrating functionality:

### screenshot-1

![search-books-page](./client/src/assets/screenshot-1.png)

### screenshot-2

![login-signup-toggle](./client/src/assets/screenshot-2.png)

### screenshot-3

![saved-books-page](./client/src/assets/screenshot-3.png)

### screenshot-4

![removeBook-mutation](./client/src/assets/screenshot-4.png)


## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Contributing Guidelines

Create a new branch for the commit and start a pull request.

## Testing

To ensure the app works correctly, the following E2E test is implemented:

Install cypress:

```zsh
npm install cypress --save-dev
npx cypress open
```

## Authors and Acknowledgements

[email] (ginadrcoder@gmail.com)

## Questions

For enquiries, please contact me at:

[email] (ginadrcoder@gmail.com)

[github] (https://github.com/gina-t)

