import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ApiClientService } from './api-client.service';
import { selectToken } from '../store/auth.selectors';

describe('ApiClientService', () => {
  let service: ApiClientService;
  let httpMock: HttpTestingController;
  let store: MockStore;

  const mockToken = 'mock-jwt-token';
  const initialState = { auth: { token: mockToken } };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiClientService,
        provideMockStore({ initialState }),
      ],
    });

    service = TestBed.inject(ApiClientService);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(MockStore);
    store.overrideSelector(selectToken, mockToken);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('GET request', () => {
    it('should send GET request with authorization header', () => {
      const testData = { data: 'test' };

      service.get('/test').subscribe((data) => {
        expect(data).toEqual(testData);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/test');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBe(true);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(testData);
    });
  });

  describe('POST request', () => {
    it('should send POST request with body and authorization header', () => {
      const testData = { name: 'Test' };
      const responseData = { id: 1, ...testData };

      service.post('/test', testData).subscribe((data) => {
        expect(data).toEqual(responseData);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/test');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(testData);
      expect(req.request.headers.has('Authorization')).toBe(true);
      req.flush(responseData);
    });
  });

  describe('PUT request', () => {
    it('should send PUT request with body', () => {
      const testData = { id: 1, name: 'Updated' };

      service.put('/test/1', testData).subscribe((data) => {
        expect(data).toEqual(testData);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/test/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(testData);
      req.flush(testData);
    });
  });

  describe('DELETE request', () => {
    it('should send DELETE request', () => {
      service.delete('/test/1').subscribe();

      const req = httpMock.expectOne('http://localhost:3000/api/test/1');
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.has('Authorization')).toBe(true);
      req.flush({});
    });
  });

  describe('Error handling', () => {
    it('should handle HTTP errors', () => {
      const errorMessage = 'Not Found';

      service.get('/test').subscribe({
        next: () => { throw new Error('should have failed with 404 error'); },
        error: (error) => {
          expect(error.message).toContain('Error Code: 404');
        },
      });

      const req = httpMock.expectOne('http://localhost:3000/api/test');
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });
});
