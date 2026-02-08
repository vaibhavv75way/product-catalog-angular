import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Router } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { adminGuard, roleGuard } from './role.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserRole } from '../models/auth.model';
import { isObservable } from 'rxjs';

describe('Role Guards', () => {
  let store: MockStore;
  let router: any;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    const routerSpy = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: { auth: { user: null } },
        }),
        { provide: Router, useValue: routerSpy },
      ],
    });

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router) as any;
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/admin' } as RouterStateSnapshot;
  });

  describe('adminGuard', () => {
    it('should allow access for admin users', () => {
      return new Promise<void>((resolve) => {
        store.setState({
          auth: {
            user: {
              id: '1',
              email: 'admin@test.com',
              name: 'Admin',
              role: UserRole.ADMIN,
              createdAt: new Date(),
            },
          },
        });

        TestBed.runInInjectionContext(() => {
          const result = adminGuard(mockRoute, mockState);
          
          if (typeof result === 'boolean') {
            expect(result).toBe(true);
            resolve();
          } else if (isObservable(result)) {
            result.subscribe((canActivate) => {
              expect(canActivate).toBe(true);
              resolve();
            });
          } else {
            resolve();
          }
        });
      });
    });

    it('should deny access for non-admin users', () => {
      return new Promise<void>((resolve) => {
        store.setState({
          auth: {
            user: {
              id: '2',
              email: 'user@test.com',
              name: 'User',
              role: UserRole.USER,
              createdAt: new Date(),
            },
          },
        });

        TestBed.runInInjectionContext(() => {
          const result = adminGuard(mockRoute, mockState);
          
          if (typeof result === 'boolean') {
            expect(result).toBe(false);
            expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
            resolve();
          } else if (isObservable(result)) {
            result.subscribe((canActivate) => {
              expect(canActivate).toBe(false);
              expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
              resolve();
            });
          } else {
            resolve();
          }
        });
      });
    });
  });

  describe('roleGuard factory', () => {
    it('should allow access for users with allowed roles', () => {
      return new Promise<void>((resolve) => {
        store.setState({
          auth: {
            user: {
              id: '1',
              email: 'mod@test.com',
              name: 'Moderator',
              role: UserRole.MODERATOR,
              createdAt: new Date(),
            },
          },
        });

        TestBed.runInInjectionContext(() => {
          const guard = roleGuard([UserRole.ADMIN, UserRole.MODERATOR]);
          const result = guard(mockRoute, mockState);
          
          if (typeof result === 'boolean') {
            expect(result).toBe(true);
            resolve();
          } else if (isObservable(result)) {
            result.subscribe((canActivate) => {
              expect(canActivate).toBe(true);
              resolve();
            });
          } else {
            resolve();
          }
        });
      });
    });

    it('should deny access for users without allowed roles', () => {
      return new Promise<void>((resolve) => {
        store.setState({
          auth: {
            user: {
              id: '2',
              email: 'user@test.com',
              name: 'User',
              role: UserRole.USER,
              createdAt: new Date(),
            },
          },
        });

        TestBed.runInInjectionContext(() => {
          const guard = roleGuard([UserRole.ADMIN]);
          const result = guard(mockRoute, mockState);
          
          if (typeof result === 'boolean') {
            expect(result).toBe(false);
            expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
            resolve();
          } else if (isObservable(result)) {
            result.subscribe((canActivate) => {
              expect(canActivate).toBe(false);
              expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
              resolve();
            });
          } else {
            resolve();
          }
        });
      });
    });
  });
});
