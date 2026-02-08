import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { cartReducer } from './store/cart.reducer';
import { authReducer } from './store/auth.reducer';
import { CartEffects } from './store/cart.effects';
import { AuthEffects } from './store/auth.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { Store } from '@ngrx/store';
import { CartState } from './models/cart.model';
import { AuthState } from './models/auth.model';
import * as CartActions from './store/cart.actions';
import * as AuthActions from './store/auth.actions';
import { authInterceptor, loggingInterceptor } from './services/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export function initializeCart(store: Store<{ cart: CartState }>) {
  return () => {
    store.dispatch(CartActions.loadCartFromLocalStorage());
  };
}

export function initializeAuth(store: Store<{ auth: AuthState }>) {
  return () => {
    store.dispatch(AuthActions.loadAuthFromStorage());
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, loggingInterceptor])
    ),
    provideAnimationsAsync(),
    provideStore({
        cart: cartReducer,
        auth: authReducer,
    }),
    provideEffects([CartEffects, AuthEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeCart,
      deps: [Store],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [Store],
      multi: true,
    },
],
};
