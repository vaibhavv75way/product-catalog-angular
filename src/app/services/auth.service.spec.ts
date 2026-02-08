import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AuthService } from './auth.service';
import { ApiClientService } from './api-client.service';
import { of } from 'rxjs';
import { LoginCredentials, AuthResponse, UserRole } from '../models/auth.model';

describe('AuthService', () => {
  let service: AuthService;
  let apiClientSpy: any;

  const mockAuthResponse: AuthResponse = {
    user: {
      id: '1',
      email: 'admin@test.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
      createdAt: new Date(),
    },
    token: 'mock-jwt-token',
    refreshToken: 'mock-refresh-token',
    expiresIn: 3600,
  };

  beforeEach(() => {
    const spy = { post: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: ApiClientService, useValue: spy },
      ],
    });

    service = TestBed.inject(AuthService);
    apiClientSpy = TestBed.inject(ApiClientService) as any;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should call API client with credentials', () => {
      const credentials: LoginCredentials = {
        email: 'admin@test.com',
        password: 'password123',
      };

      apiClientSpy.post.and.returnValue(of(mockAuthResponse));

      service.login(credentials).subscribe((response) => {
        expect(response).toEqual(mockAuthResponse);
      });

      expect(apiClientSpy.post).toHaveBeenCalledWith('/auth/login', credentials);
    });
  });

  describe('storeTokens', () => {
    it('should store tokens and user data in localStorage', () => {
      service.storeTokens(mockAuthResponse);

      expect(localStorage.getItem('auth_token')).toBe(mockAuthResponse.token);
      expect(localStorage.getItem('refresh_token')).toBe(mockAuthResponse.refreshToken);
      expect(localStorage.getItem('user_data')).toBe(JSON.stringify(mockAuthResponse.user));
    });
  });

  describe('getStoredAuthData', () => {
    it('should retrieve stored auth data', () => {
      service.storeTokens(mockAuthResponse);

      const storedData = service.getStoredAuthData();

      expect(storedData).toBeTruthy();
      expect(storedData?.token).toBe(mockAuthResponse.token);
      expect(storedData?.refreshToken).toBe(mockAuthResponse.refreshToken);
      expect(storedData?.user.email).toBe(mockAuthResponse.user.email);
    });

    it('should return null when no data is stored', () => {
      const storedData = service.getStoredAuthData();
      expect(storedData).toBeNull();
    });
  });

  describe('clearTokens', () => {
    it('should remove all tokens from localStorage', () => {
      service.storeTokens(mockAuthResponse);
      service.clearTokens();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
      expect(localStorage.getItem('user_data')).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('should return true for expired token', () => {
      // Create token that expired yesterday
      const expiredPayload = {
        sub: '1',
        email: 'test@test.com',
        role: UserRole.USER,
        iat: Math.floor(Date.now() / 1000) - 86400,
        exp: Math.floor(Date.now() / 1000) - 3600,
      };
      const expiredToken = createMockToken(expiredPayload);

      expect(service.isTokenExpired(expiredToken)).toBe(true);
    });

    it('should return false for valid token', () => {
      // Create token that expires tomorrow
      const validPayload = {
        sub: '1',
        email: 'test@test.com',
        role: UserRole.USER,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400,
      };
      const validToken = createMockToken(validPayload);

      expect(service.isTokenExpired(validToken)).toBe(false);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when valid token exists', () => {
      const validPayload = {
        sub: '1',
        email: 'test@test.com',
        role: UserRole.USER,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400,
      };
      const validToken = createMockToken(validPayload);
      localStorage.setItem('auth_token', validToken);

      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when no token exists', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return false when token is expired', () => {
      const expiredPayload = {
        sub: '1',
        email: 'test@test.com',
        role: UserRole.USER,
        iat: Math.floor(Date.now() / 1000) - 86400,
        exp: Math.floor(Date.now() / 1000) - 3600,
      };
      const expiredToken = createMockToken(expiredPayload);
      localStorage.setItem('auth_token', expiredToken);

      expect(service.isAuthenticated()).toBe(false);
    });
  });
});

// Helper function to create mock JWT token
function createMockToken(payload: any): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = 'mock-signature';
  return `${header}.${encodedPayload}.${signature}`;
}
