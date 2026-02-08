import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';
import { adminGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home')
        .then(m => m.Home),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/products')
        .then(m => m.ProductsCatalog),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./pages/single-product/single-product')
        .then(m => m.SingleProduct),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart')
        .then(m => m.Cart),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/login/login')
        .then(m => m.Login),
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./pages/unauthorized/unauthorized')
        .then(m => m.Unauthorized),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/admin/admin-dashboard/admin-dashboard')
            .then(m => m.AdminDashboard),
      },
      {
        path: 'audit-logs',
        loadComponent: () =>
          import('./pages/admin/audit-logs/audit-logs')
            .then(m => m.AuditLogs),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];