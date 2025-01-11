import { jwtDecode } from 'jwt-decode';
import type { UserProfile } from '../models/UserProfile';

// Interface for JWT token information
interface UserToken {
  name: string;
  exp: number;
}


class AuthService {
  getProfile(): UserProfile {
    return jwtDecode<UserProfile>(this.getToken()!);
  }

  getToken(): string | null {
    return localStorage.getItem('id_token');
  }

  loggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded: UserToken = jwtDecode(token);
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  login(idToken: string): void {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout(): void {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();
