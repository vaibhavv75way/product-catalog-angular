import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { selectIsAuthenticated } from '../store/auth.selectors';

/**
 * Guard to protect routes that require authentication
 */
export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        return true;
      } else {
        // Redirect to login page with return url
        router.navigate(['/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }
    })
  );
};

/**
 * Guard to redirect authenticated users away from login/register pages
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map((isAuthenticated: boolean) => {
      if (!isAuthenticated) {
        return true;
      } else {
        // Redirect to home page if already authenticated
        router.navigate(['/']);
        return false;
      }
    })
  );
};
