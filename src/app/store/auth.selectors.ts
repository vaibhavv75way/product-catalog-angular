import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState, UserRole } from '../models/auth.model';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

export const selectRefreshToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.refreshToken
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectUserRole = createSelector(
  selectUser,
  (user) => user?.role
);

export const selectIsAdmin = createSelector(
  selectUserRole,
  (role) => role === UserRole.ADMIN
);

export const selectIsModerator = createSelector(
  selectUserRole,
  (role) => role === UserRole.MODERATOR || role === UserRole.ADMIN
);

export const selectUserEmail = createSelector(
  selectUser,
  (user) => user?.email
);

export const selectUserName = createSelector(
  selectUser,
  (user) => user?.name
);
