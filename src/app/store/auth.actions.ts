import { createAction, props } from '@ngrx/store';
import { User, LoginCredentials, AuthResponse } from '../models/auth.model';

// Login Actions
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginCredentials }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ authResponse: AuthResponse }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Logout Actions
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

// Token Actions
export const refreshToken = createAction('[Auth] Refresh Token');

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ token: string; refreshToken: string; expiresIn: number }>()
);

export const refreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
  props<{ error: string }>()
);

// Load Token from Storage
export const loadAuthFromStorage = createAction('[Auth] Load From Storage');

export const loadAuthFromStorageSuccess = createAction(
  '[Auth] Load From Storage Success',
  props<{ user: User; token: string; refreshToken: string }>()
);

// Update User Actions
export const updateUser = createAction(
  '[Auth] Update User',
  props<{ user: User }>()
);

// Clear Auth State
export const clearAuthState = createAction('[Auth] Clear State');
