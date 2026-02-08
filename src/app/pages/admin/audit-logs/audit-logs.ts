import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuditService } from '../../../services/audit.service';
import { AuditLog, AuditAction, AuditLogFilter } from '../../../models/audit.model';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './audit-logs.html',
  styleUrls: ['./audit-logs.css'],
})
export class AuditLogs implements OnInit {
  auditLogs = signal<AuditLog[]>([]);
  isLoading = signal(false);
  filterForm: FormGroup;

  displayedColumns: string[] = [
    'timestamp',
    'userName',
    'action',
    'resource',
    'status',
    'details',
  ];

  auditActions = Object.values(AuditAction);
  statusOptions = ['SUCCESS', 'FAILURE'];

  constructor(
    private auditService: AuditService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      userId: [''],
      action: [''],
      resource: [''],
      status: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  ngOnInit(): void {
    this.loadAuditLogs();
  }

  loadAuditLogs(): void {
    this.isLoading.set(true);
    const filter = this.getFilterValues();
    
    this.auditService.getAuditLogs(filter).subscribe({
      next: (logs) => {
        this.auditLogs.set(logs);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load audit logs', error);
        this.isLoading.set(false);
      },
    });
  }

  applyFilter(): void {
    this.loadAuditLogs();
  }

  clearFilter(): void {
    this.filterForm.reset();
    this.loadAuditLogs();
  }

  exportLogs(): void {
    const filter = this.getFilterValues();
    this.auditService.exportAuditLogs(filter).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `audit-logs-${new Date().toISOString()}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => console.error('Export failed', error),
    });
  }

  private getFilterValues(): AuditLogFilter | undefined {
    const values = this.filterForm.value;
    const filter: AuditLogFilter = {};

    if (values.userId) filter.userId = values.userId;
    if (values.action) filter.action = values.action;
    if (values.resource) filter.resource = values.resource;
    if (values.status) filter.status = values.status;
    if (values.startDate) filter.startDate = values.startDate;
    if (values.endDate) filter.endDate = values.endDate;

    return Object.keys(filter).length > 0 ? filter : undefined;
  }

  getStatusColor(status: string): string {
    return status === 'SUCCESS' ? 'primary' : 'warn';
  }
}
