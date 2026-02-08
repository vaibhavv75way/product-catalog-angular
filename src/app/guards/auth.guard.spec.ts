import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Router } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { authGuard, guestGuard } from './auth.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { isObservable } from 'rxjs';

describe('Auth Guards', () => {
  let store: MockStore;
  let router: any;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    const routerSpy = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState: { auth: { isAuthenticated: false } } }),
        { provide: Router, useValue: routerSpy },
      ],
    });

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router) as any;
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/admin' } as RouterStateSnapshot;
  });

  describe('authGuard', () => {
    it('should allow access when user is authenticated', () => {
      return new Promise<void>((resolve) => {
        store.setState({ auth: { isAuthenticated: true } });

        TestBed.runInInjectionContext(() => {
          const result = authGuard(mockRoute, mockState);
          
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

    it('should redirect to login when user is not authenticated', () => {
      return new Promise<void>((resolve) => {
        store.setState({ auth: { isAuthenticated: false } });

        TestBed.runInInjectionContext(() => {
          const result = authGuard(mockRoute, mockState);
          
          if (typeof result === 'boolean') {
            expect(result).toBe(false);
            expect(router.navigate).toHaveBeenCalledWith(['/login'], {
              queryParams: { returnUrl: mockState.url },
            });
            resolve();
          } else if (isObservable(result)) {
            result.subscribe((canActivate) => {
              expect(canActivate).toBe(false);
              expect(router.navigate).toHaveBeenCalledWith(['/login'], {
                queryParams: { returnUrl: mockState.url },
              });
              resolve();
            });
          } else {
            resolve();
          }
        });
      });
    });
  });

  describe('guestGuard', () => {
    it('should allow access when user is not authenticated', () => {
      return new Promise<void>((resolve) => {
        store.setState({ auth: { isAuthenticated: false } });

        TestBed.runInInjectionContext(() => {
          const result = guestGuard(mockRoute, mockState);
          
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

    it('should redirect to home when user is authenticated', () => {
      return new Promise<void>((resolve) => {
        store.setState({ auth: { isAuthenticated: true } });

        TestBed.runInInjectionContext(() => {
          const result = guestGuard(mockRoute, mockState);
          
          if (typeof result === 'boolean') {
            expect(result).toBe(false);
            expect(router.navigate).toHaveBeenCalledWith(['/']);
            resolve();
          } else if (isObservable(result)) {
            result.subscribe((canActivate) => {
              expect(canActivate).toBe(false);
              expect(router.navigate).toHaveBeenCalledWith(['/']);
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
