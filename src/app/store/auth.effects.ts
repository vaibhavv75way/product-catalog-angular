import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, timer } from 'rxjs';
import { map, catchError, exhaustMap, tap, switchMap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { AuthService } from '../services/auth.service';
import { AuditService } from '../services/audit.service';
import { AuditAction } from '../models/audit.model';
import { AuthResponse } from '../models/auth.model';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private auditService = inject(AuditService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((authResponse: AuthResponse) => {
            // Store tokens in localStorage
            this.authService.storeTokens(authResponse);
            return AuthActions.loginSuccess({ authResponse });
          }),
          catchError((error: any) =>
            of(AuthActions.loginFailure({ error: error.message || 'Login failed' }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ authResponse }: { authResponse: AuthResponse }) => {
          // Log successful login
          this.auditService.logAction({
            action: AuditAction.LOGIN,
            resource: 'AUTH',
            details: { email: authResponse.user.email },
            status: 'SUCCESS',
          });
        })
      ),
    { dispatch: false }
  );

  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap(({ error }: { error: string }) => {
          // Log failed login
          this.auditService.logAction({
            action: AuditAction.LOGIN,
            resource: 'AUTH',
            details: { error },
            status: 'FAILURE',
          });
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      exhaustMap(() =>
        this.authService.logout().pipe(
          map(() => {
            this.authService.clearTokens();
            return AuthActions.logoutSuccess();
          }),
          catchError(() => {
            this.authService.clearTokens();
            return of(AuthActions.logoutSuccess());
          })
        )
      )
    )
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          // Log successful logout
          this.auditService.logAction({
            action: AuditAction.LOGOUT,
            resource: 'AUTH',
            status: 'SUCCESS',
          });
        })
      ),
    { dispatch: false }
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      exhaustMap(() =>
        this.authService.refreshToken().pipe(
          map((response: AuthResponse) => {
            this.authService.storeTokens({
              user: response.user,
              token: response.token,
              refreshToken: response.refreshToken,
              expiresIn: response.expiresIn,
            });
            return AuthActions.refreshTokenSuccess({
              token: response.token,
              refreshToken: response.refreshToken,
              expiresIn: response.expiresIn,
            });
          }),
          catchError((error: any) =>
            of(AuthActions.refreshTokenFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadAuthFromStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadAuthFromStorage),
      switchMap(() => {
        const authData = this.authService.getStoredAuthData();
        if (authData && authData.token && authData.user) {
          // Check if token is still valid
          if (!this.authService.isTokenExpired(authData.token)) {
            return of(
              AuthActions.loadAuthFromStorageSuccess({
                user: authData.user,
                token: authData.token,
                refreshToken: authData.refreshToken,
              })
            );
          }
        }
        return of(AuthActions.clearAuthState());
      })
    )
  );
}
