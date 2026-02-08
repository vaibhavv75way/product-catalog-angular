import { describe, it, expect } from 'vitest';
import { authReducer, initialAuthState } from './auth.reducer';
import * as AuthActions from './auth.actions';
import { AuthResponse, UserRole } from '../models/auth.model';

describe('Auth Reducer', () => {
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

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = { type: 'Unknown' };
      const state = authReducer(initialAuthState, action as any);

      expect(state).toBe(initialAuthState);
    });
  });

  describe('login action', () => {
    it('should set loading to true on login', () => {
      const credentials = { email: 'test@test.com', password: 'password' };
      const action = AuthActions.login({ credentials });
      const state = authReducer(initialAuthState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('loginSuccess action', () => {
    it('should set user and tokens on login success', () => {
      const action = AuthActions.loginSuccess({ authResponse: mockAuthResponse });
      const state = authReducer(initialAuthState, action);

      expect(state.user).toEqual(mockAuthResponse.user);
      expect(state.token).toBe(mockAuthResponse.token);
      expect(state.refreshToken).toBe(mockAuthResponse.refreshToken);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('loginFailure action', () => {
    it('should set error on login failure', () => {
      const error = 'Invalid credentials';
      const action = AuthActions.loginFailure({ error });
      const state = authReducer(initialAuthState, action);

      expect(state.error).toBe(error);
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('logout action', () => {
    it('should set loading on logout', () => {
      const loggedInState = {
        ...initialAuthState,
        user: mockAuthResponse.user,
        token: mockAuthResponse.token,
        isAuthenticated: true,
      };
      const action = AuthActions.logout();
      const state = authReducer(loggedInState, action);

      expect(state.isLoading).toBe(true);
    });
  });

  describe('logoutSuccess action', () => {
    it('should reset to initial state on logout success', () => {
      const loggedInState = {
        ...initialAuthState,
        user: mockAuthResponse.user,
        token: mockAuthResponse.token,
        isAuthenticated: true,
      };
      const action = AuthActions.logoutSuccess();
      const state = authReducer(loggedInState, action);

      expect(state).toEqual(initialAuthState);
    });
  });

  describe('refreshTokenSuccess action', () => {
    it('should update tokens on refresh success', () => {
      const newToken = 'new-token';
      const newRefreshToken = 'new-refresh-token';
      const action = AuthActions.refreshTokenSuccess({
        token: newToken,
        refreshToken: newRefreshToken,
        expiresIn: 3600,
      });
      const state = authReducer(initialAuthState, action);

      expect(state.token).toBe(newToken);
      expect(state.refreshToken).toBe(newRefreshToken);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('loadAuthFromStorageSuccess action', () => {
    it('should load auth data from storage', () => {
      const action = AuthActions.loadAuthFromStorageSuccess({
        user: mockAuthResponse.user,
        token: mockAuthResponse.token,
        refreshToken: mockAuthResponse.refreshToken,
      });
      const state = authReducer(initialAuthState, action);

      expect(state.user).toEqual(mockAuthResponse.user);
      expect(state.token).toBe(mockAuthResponse.token);
      expect(state.refreshToken).toBe(mockAuthResponse.refreshToken);
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('clearAuthState action', () => {
    it('should reset to initial state', () => {
      const loggedInState = {
        ...initialAuthState,
        user: mockAuthResponse.user,
        token: mockAuthResponse.token,
        isAuthenticated: true,
      };
      const action = AuthActions.clearAuthState();
      const state = authReducer(loggedInState, action);

      expect(state).toEqual(initialAuthState);
    });
  });
});
