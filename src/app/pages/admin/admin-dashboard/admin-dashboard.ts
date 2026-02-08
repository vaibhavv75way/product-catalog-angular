import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { selectUser } from '../../../store/auth.selectors';
import * as AuthActions from '../../../store/auth.actions';
import { AuditService } from '../../../services/audit.service';
import { AuditAction } from '../../../models/audit.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatGridListModule,
    MatDividerModule,
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard implements OnInit {
  user$;
  
  dashboardCards = [
    {
      title: 'User Management',
      icon: 'people',
      description: 'Manage users, roles, and permissions',
      route: '/admin/users',
      color: '#3f51b5',
    },
    {
      title: 'Audit Logs',
      icon: 'history',
      description: 'View system audit logs and activity',
      route: '/admin/audit-logs',
      color: '#009688',
    },
    {
      title: 'Products',
      icon: 'inventory',
      description: 'Manage product catalog',
      route: '/products',
      color: '#ff9800',
    },
    {
      title: 'Analytics',
      icon: 'analytics',
      description: 'View analytics and reports',
      route: '/admin/analytics',
      color: '#e91e63',
    },
  ];

  constructor(
    private store: Store,
    private router: Router,
    private auditService: AuditService
  ) {
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.auditService.logAction({
      action: AuditAction.VIEW,
      resource: 'ADMIN_DASHBOARD',
      status: 'SUCCESS',
    });
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/login']);
  }
}
