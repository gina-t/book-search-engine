import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Construct the absolute path to the server.env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load the .env file
dotenv.config({ path: path.resolve(__dirname, '../../env/server.env') });

import express, { Request, Response } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { connectDB } from './config/connection.js';
import { typeDefs, resolvers } from './schemas/index.js';
import cors from 'cors';
import routes from './routes/index.js';
import { authenticateToken } from './services/auth.js';

console.log('JWT_SECRET_KEY in server.ts:', process.env.JWT_SECRET_KEY);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();
  await connectDB();

  const PORT = process.env.PORT || 3001;
  const app = express();

  // Middleware to parse JSON requests
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Configure CORS
  const corsOptions = {
    origin: 'http://localhost:3000', // Vite development server URL
    credentials: true,
  };
  app.use(cors(corsOptions));

  // Use routes
  app.use('/api', routes);

  // Important for MERN Setup: Any client-side requests that begin with '/graphql' will be handled by our Apollo Server
  app.use('/graphql', expressMiddleware(server, {
    context: ({ req }) => authenticateToken({ req }),
  }));

  // Serve client/dist as static assets
  // const staticPath = path.join(__dirname, '../../client/dist');
  // console.log(`Serving static files from: ${staticPath}`);
  // app.use(express.static(staticPath));
  
  // Serve static files from the React app
  if (process.env.NODE_ENV === 'production') {
    const staticPath = path.join(__dirname, '../../client/dist');
    console.log(`Serving static files from: ${staticPath}`);
    app.use(express.static(staticPath));

    app.get('*', (_req: Request, res: Response) => {
      const indexPath = path.join(__dirname, '../../client/dist/index.html');
      console.log(`Serving index.html from: ${indexPath}`);
      res.sendFile(indexPath);
    });
  } else {
    app.get('*', (_req: Request, res: Response) => {
      res.send('API is running...');
    });
  }

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
