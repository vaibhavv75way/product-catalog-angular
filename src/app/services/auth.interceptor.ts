import { Injectable } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { selectToken, selectRefreshToken } from '../store/auth.selectors';
import * as AuthActions from '../store/auth.actions';
import { Router } from '@angular/router';

/**
 * HTTP Interceptor to add JWT token to requests
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const store = inject(Store);
  const router = inject(Router);

  // Skip token for auth endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
    return next(req);
  }

  return store.select(selectToken).pipe(
    take(1),
    switchMap((token: string | null) => {
      // Clone request and add authorization header if token exists
      let authReq = req;
      if (token) {
        authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          // Handle 401 Unauthorized errors
          if (error.status === 401) {
            // Try to refresh token
            return store.select(selectRefreshToken).pipe(
              take(1),
              switchMap((refreshToken: string | null) => {
                if (refreshToken) {
                  store.dispatch(AuthActions.refreshToken());
                  // Retry the original request after token refresh
                  return store.select(selectToken).pipe(
                    take(1),
                    switchMap((newToken: string | null) => {
                      if (newToken) {
                        const retryReq = req.clone({
                          setHeaders: {
                            Authorization: `Bearer ${newToken}`,
                          },
                        });
                        return next(retryReq);
                      }
                      // If still no token, logout and redirect
                      store.dispatch(AuthActions.logout());
                      router.navigate(['/login']);
                      return throwError(() => error);
                    })
                  );
                } else {
                  // No refresh token, logout and redirect
                  store.dispatch(AuthActions.logout());
                  router.navigate(['/login']);
                  return throwError(() => error);
                }
              })
            );
          }

          // Handle 403 Forbidden errors
          if (error.status === 403) {
            router.navigate(['/unauthorized']);
          }

          return throwError(() => error);
        })
      );
    })
  );
};

/**
 * Logging Interceptor for debugging
 */
export const loggingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  console.log(`[HTTP] ${req.method} ${req.url}`);
  const startTime = Date.now();

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const duration = Date.now() - startTime;
      console.error(`[HTTP] ${req.method} ${req.url} - Error (${duration}ms)`, error);
      return throwError(() => error);
    })
  );
};
