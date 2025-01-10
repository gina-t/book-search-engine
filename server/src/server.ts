import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'node:path';
import { connectDB } from './config/connection.js';
import { typeDefs, resolvers } from './schemas/index.js';
import dotenv from 'dotenv';
import { getUserFromToken } from './services/auth.js';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON requests
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Use routes
app.use(routes);

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization;
        const user = getUserFromToken(authHeader);
        return { user };
      },
    })
  );

  console.log(`Environment PORT: ${process.env.PORT}`);
  console.log(`Environment NODE_ENV: ${process.env.NODE_ENV}`);

  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer().catch((error) => {
  console.error('Error starting Apollo Server:', error);
});

