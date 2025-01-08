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
npm install bcrypt express jsonwebtoken mongoose @apollo/server graphql graphql-tools
npm install @types/bcrypt @types/express @types jsonwebtoken @types/node dotenv nodemon typescript ts-node --save-dev

"nodemonConfig": {
  "watch": [
    "src"
  ],
  "ext": "ts,json,js",
  "excec": "ts-node src/server.ts"}
```
4. In 'client' folder, install dependencies:

```zsh 
npm install bootstap jwt-decode react react-bootstarp react-dom react-router-dom
npm install @types/react @types/react-dom eslint vite --save-dev
```

5. Configure TypeScript:

- root/tsconfig.json conatins the base configuration
- server/tsconfig.json extends the root and adds settings specific to the server-side
- client/tsconfig.json extends the root and adds settings specific to the client-side

6. In 'root' directory, create .gitignore file and add:

.env
node_modules

7. In 'root' directory, create .env file and add:

```javascript
MONGODB_URI='mongodb://127.0.0.1:27017/googlebooks'
JWT_SECRET_KEY=''

```
8. In 'server' folder, generate secret token for JWT:

```zsh
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

9. Copy the generated secret token and paste into JWT_SECRET_KEY field in the .env file.

10. In 'server.ts', define routes and middleware.