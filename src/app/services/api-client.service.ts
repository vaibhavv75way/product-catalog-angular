import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectToken } from '../store/auth.selectors';
import { environment } from '../../environments/environment';

export interface ApiClientConfig {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  withCredentials?: boolean;
  retryAttempts?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private baseUrl: string = environment.apiUrl || 'http://localhost:3000/api';
  private token: string | null = null;

  constructor(
    private http: HttpClient,
    private store: Store
  ) {
    // Subscribe to token changes
    this.store.select(selectToken).subscribe((token) => {
      this.token = token;
    });
  }

  /**
   * Create headers with authentication token
   */
  private createHeaders(customHeaders?: HttpHeaders | { [header: string]: string | string[] }): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...customHeaders,
    });

    if (this.token) {
      headers = headers.set('Authorization', `Bearer ${this.token}`);
    }

    return headers;
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      
      if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }

    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * GET request
   */
  get<T>(endpoint: string, config?: ApiClientConfig): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.createHeaders(config?.headers);
    
    return this.http
      .get<T>(url, {
        headers,
        params: config?.params,
        withCredentials: config?.withCredentials,
      })
      .pipe(
        retry(config?.retryAttempts || 0),
        catchError(this.handleError)
      );
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, body: any, config?: ApiClientConfig): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.createHeaders(config?.headers);
    
    return this.http
      .post<T>(url, body, {
        headers,
        params: config?.params,
        withCredentials: config?.withCredentials,
      })
      .pipe(
        retry(config?.retryAttempts || 0),
        catchError(this.handleError)
      );
  }

  /**
   * PUT request
   */
  put<T>(endpoint: string, body: any, config?: ApiClientConfig): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.createHeaders(config?.headers);
    
    return this.http
      .put<T>(url, body, {
        headers,
        params: config?.params,
        withCredentials: config?.withCredentials,
      })
      .pipe(
        retry(config?.retryAttempts || 0),
        catchError(this.handleError)
      );
  }

  /**
   * PATCH request
   */
  patch<T>(endpoint: string, body: any, config?: ApiClientConfig): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.createHeaders(config?.headers);
    
    return this.http
      .patch<T>(url, body, {
        headers,
        params: config?.params,
        withCredentials: config?.withCredentials,
      })
      .pipe(
        retry(config?.retryAttempts || 0),
        catchError(this.handleError)
      );
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string, config?: ApiClientConfig): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.createHeaders(config?.headers);
    
    return this.http
      .delete<T>(url, {
        headers,
        params: config?.params,
        withCredentials: config?.withCredentials,
      })
      .pipe(
        retry(config?.retryAttempts || 0),
        catchError(this.handleError)
      );
  }

  /**
   * Upload file
   */
  uploadFile<T>(endpoint: string, file: File, additionalData?: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.keys(additionalData).forEach((key) => {
        formData.append(key, additionalData[key]);
      });
    }

    let headers = new HttpHeaders();
    if (this.token) {
      headers = headers.set('Authorization', `Bearer ${this.token}`);
    }

    return this.http
      .post<T>(url, formData, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Download file
   */
  downloadFile(endpoint: string, filename: string): Observable<Blob> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.createHeaders();

    return this.http
      .get(url, {
        headers,
        responseType: 'blob',
      })
      .pipe(catchError(this.handleError));
  }
}
