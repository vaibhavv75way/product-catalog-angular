import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiClientService } from './api-client.service';
import { AuditLog, AuditAction, AuditLogFilter } from '../models/audit.model';
import { Store } from '@ngrx/store';
import { selectUser } from '../store/auth.selectors';

interface CreateAuditLogDto {
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details?: any;
  status: 'SUCCESS' | 'FAILURE';
}

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private currentUser$;
  
  // In-memory audit logs for demo (in production, this would be backend-only)
  private auditLogs = signal<AuditLog[]>([]);
  
  constructor(
    private apiClient: ApiClientService,
    private store: Store
  ) {
    this.currentUser$ = this.store.select(selectUser);
  }

  /**
   * Log an action to audit trail
   */
  logAction(data: CreateAuditLogDto): void {
    this.currentUser$.subscribe((user: any) => {
      const auditLog: AuditLog = {
        id: this.generateId(),
        userId: user?.id || 'anonymous',
        userName: user?.name || 'Anonymous',
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId,
        details: data.details,
        ipAddress: this.getClientIp(),
        userAgent: navigator.userAgent,
        timestamp: new Date(),
        status: data.status,
      };

      // Store locally for demo
      this.auditLogs.update((logs: AuditLog[]) => [...logs, auditLog]);

      // Send to backend
      this.apiClient
        .post<AuditLog>('/audit/logs', auditLog)
        .subscribe({
          next: () => console.log('Audit log saved'),
          error: (err: any) => console.error('Failed to save audit log', err),
        });
    }).unsubscribe();
  }

  /**
   * Get audit logs with filters
   */
  getAuditLogs(filter?: AuditLogFilter): Observable<AuditLog[]> {
    // In production, this would fetch from backend
    // For demo, return local logs
    let logs = this.auditLogs();

    if (filter) {
      logs = logs.filter((log: AuditLog) => {
        if (filter.userId && log.userId !== filter.userId) return false;
        if (filter.action && log.action !== filter.action) return false;
        if (filter.resource && !log.resource.includes(filter.resource)) return false;
        if (filter.status && log.status !== filter.status) return false;
        if (filter.startDate && new Date(log.timestamp) < filter.startDate) return false;
        if (filter.endDate && new Date(log.timestamp) > filter.endDate) return false;
        return true;
      });
    }

    return of(logs.sort((a: AuditLog, b: AuditLog) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  }

  /**
   * Get audit logs from API (production)
   */
  getAuditLogsFromApi(filter?: AuditLogFilter): Observable<AuditLog[]> {
    const params: any = {};
    if (filter) {
      if (filter.userId) params.userId = filter.userId;
      if (filter.action) params.action = filter.action;
      if (filter.resource) params.resource = filter.resource;
      if (filter.status) params.status = filter.status;
      if (filter.startDate) params.startDate = filter.startDate.toISOString();
      if (filter.endDate) params.endDate = filter.endDate.toISOString();
    }

    return this.apiClient.get<AuditLog[]>('/audit/logs', { params });
  }

  /**
   * Export audit logs
   */
  exportAuditLogs(filter?: AuditLogFilter): Observable<Blob> {
    const params: any = {};
    if (filter) {
      if (filter.userId) params.userId = filter.userId;
      if (filter.action) params.action = filter.action;
      if (filter.resource) params.resource = filter.resource;
      if (filter.status) params.status = filter.status;
      if (filter.startDate) params.startDate = filter.startDate.toISOString();
      if (filter.endDate) params.endDate = filter.endDate.toISOString();
    }

    return this.apiClient.downloadFile('/audit/logs/export', 'audit-logs.csv');
  }

  /**
   * Get audit statistics
   */
  getAuditStatistics(): Observable<any> {
    return this.apiClient.get<any>('/audit/statistics');
  }

  /**
   * Generate unique ID (simple implementation)
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get client IP (placeholder - would need backend support)
   */
  private getClientIp(): string {
    return 'N/A';
  }
}
