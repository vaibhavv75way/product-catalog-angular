import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { selectUserRole } from '../store/auth.selectors';
import { UserRole } from '../models/auth.model';

/**
 * Factory function to create role-based guards
 */
export function roleGuard(allowedRoles: UserRole[]): CanActivateFn {
  return (route, state) => {
    const store = inject(Store);
    const router = inject(Router);

    return store.select(selectUserRole).pipe(
      take(1),
      map((userRole) => {
        if (userRole && allowedRoles.includes(userRole)) {
          return true;
        } else {
          // Redirect to unauthorized page
          router.navigate(['/unauthorized']);
          return false;
        }
      })
    );
  };
}

/**
 * Guard specifically for admin routes
 */
export const adminGuard: CanActivateFn = roleGuard([UserRole.ADMIN]);

/**
 * Guard for admin and moderator routes
 */
export const moderatorGuard: CanActivateFn = roleGuard([
  UserRole.ADMIN,
  UserRole.MODERATOR,
]);
