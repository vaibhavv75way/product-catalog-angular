export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  status: 'SUCCESS' | 'FAILURE';
}

export enum AuditAction {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  ACCESS_DENIED = 'ACCESS_DENIED',
}

export interface AuditLogFilter {
  userId?: string;
  action?: AuditAction;
  resource?: string;
  startDate?: Date;
  endDate?: Date;
  status?: 'SUCCESS' | 'FAILURE';
}
