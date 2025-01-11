import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';

interface UserToken {
  _id: string;
  username: string;
  email: string;
  exp: number;
}

const secretKey = process.env.JWT_SECRET_KEY || '';
const expiration = '2h';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }

      req.user = user as UserToken;
      return next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

// Function to get the user from the token for GraphQL context
export const getUserFromToken = (authHeader: string | undefined): UserToken | null => {
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      const user = jwt.verify(token, secretKey) as UserToken;
      return user;
    } catch (err) {
      return null;
    }
  }
  return null;
};

// Function to sign a token
export const signToken = ({ username, email, _id }: { username: string; email: string; _id: string }): string => {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, secretKey, { expiresIn: expiration });
};

// AuthService class for client-side token handling
class AuthService {
  // get user data
  getProfile() {
    return jwtDecode<UserToken>(this.getToken() || '');
  }

  // check if user's logged in
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); // handwaiving here
  }

  // check if token is expired
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<UserToken>(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } 
      
      return false;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token');
  }

  login(idToken: string) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    // this will reload the page and reset the state of the application
    window.location.assign('/');
  }
}

export default new AuthService();