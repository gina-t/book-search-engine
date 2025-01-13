import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Construct the absolute path to the server.env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load the .env file
dotenv.config({ path: path.resolve(__dirname, '../../../env/server.env') });

console.log('JWT_SECRET_KEY in auth.ts:', process.env.JWT_SECRET_KEY); // Log the JWT secret key

import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';

export const authenticateToken = ({ req }: { req: any }) => {
  let token = req.body?.token || req.query?.token || req.headers?.authorization;

  if (req.headers?.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    console.log('No token provided');
    return req;
  }

  try {
    console.log('Verifying token:', token); // Log the token being verified
    const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '2hr' });
    req.user = data;
    console.log('Token verified, user data:', data); // Log the user data
  } catch (err) {
    console.log('Invalid token:', err); // Log the error if token verification fails
  }

  return req;
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey: any = process.env.JWT_SECRET_KEY;

  console.log('Signing token with payload:', payload); // Log the payload being signed
  return jwt.sign({ data: payload }, secretKey, { expiresIn: '2h' });
};

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
}