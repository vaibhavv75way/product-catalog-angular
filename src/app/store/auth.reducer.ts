import { createReducer, on } from '@ngrx/store';
import { AuthState } from '../models/auth.model';
import * as AuthActions from './auth.actions';

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const authReducer = createReducer(
  initialAuthState,
  
  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  
  on(AuthActions.loginSuccess, (state, { authResponse }) => ({
    ...state,
    user: authResponse.user,
    token: authResponse.token,
    refreshToken: authResponse.refreshToken,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  })),
  
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  
  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    isLoading: true,
  })),
  
  on(AuthActions.logoutSuccess, () => ({
    ...initialAuthState,
  })),
  
  // Refresh Token
  on(AuthActions.refreshToken, (state) => ({
    ...state,
    isLoading: true,
  })),
  
  on(AuthActions.refreshTokenSuccess, (state, { token, refreshToken }) => ({
    ...state,
    token,
    refreshToken,
    isLoading: false,
    error: null,
  })),
  
  on(AuthActions.refreshTokenFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  
  // Load from Storage
  on(AuthActions.loadAuthFromStorageSuccess, (state, { user, token, refreshToken }) => ({
    ...state,
    user,
    token,
    refreshToken,
    isAuthenticated: true,
  })),
  
  // Update User
  on(AuthActions.updateUser, (state, { user }) => ({
    ...state,
    user,
  })),
  
  // Clear State
  on(AuthActions.clearAuthState, () => ({
    ...initialAuthState,
  }))
);
