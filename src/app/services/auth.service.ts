import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiClientService } from './api-client.service';
import { LoginCredentials, AuthResponse, User, JwtPayload } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';

  constructor(private apiClient: ApiClientService) {}

  /**
   * Login user
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.apiClient.post<AuthResponse>('/auth/login', credentials);
  }

  /**
   * Logout user
   */
  logout(): Observable<void> {
    return this.apiClient.post<void>('/auth/logout', {});
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    return this.apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
  }

  /**
   * Store authentication tokens and user data
   */
  storeTokens(authResponse: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, authResponse.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));
  }

  /**
   * Get stored authentication data
   */
  getStoredAuthData(): { token: string; refreshToken: string; user: User } | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    const userStr = localStorage.getItem(this.USER_KEY);

    if (token && refreshToken && userStr) {
      try {
        const user = JSON.parse(userStr);
        return { token, refreshToken, user };
      } catch (e) {
        return null;
      }
    }

    return null;
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Clear all stored tokens
   */
  clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      if (!payload.exp) {
        return true;
      }
      const expirationDate = new Date(payload.exp * 1000);
      return expirationDate <= new Date();
    } catch (e) {
      return true;
    }
  }

  /**
   * Decode JWT token
   */
  decodeToken(token: string): JwtPayload {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Get current user from token
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return !this.isTokenExpired(token);
  }
}
