import { async, fakeAsync, inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, RequestOptionsArgs, Response, ResponseOptions } from '@angular/http';
import { Router, RouterModule } from '@angular/router';
import { AuthHttp } from './auth.http';
import { SecurityService } from './security.service';
import { Observable } from 'rxjs/Observable';
import { MockSecurityService } from './security.service.spec';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { tokenJson } from '../testing/testing-utils.spec';
import { RouterTestingModule } from '@angular/router/testing';

export class MockAuthHttp extends AuthHttp {

  constructor() {
    super(null, null, null);
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return Observable.of(new Response(new ResponseOptions({body: {}, status: 200})));
  }

  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return Observable.of(new Response(new ResponseOptions({body: {}, status: 200})));
  }

  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return Observable.of(new Response(new ResponseOptions({body: {}, status: 200})));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return Observable.of(new Response(new ResponseOptions({body: {}, status: 200})));
  }
}

describe('auth http', () => {

  describe('with valid token', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpModule, RouterTestingModule, RouterModule.forChild([])],
        providers: [
          AuthHttp,
          MockBackend,
          BaseRequestOptions,
          {
            provide: Http,
            useFactory: (backend, defaultOptions) => {
              return new Http(backend, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions]
          },
          {provide: SecurityService, useClass: MockSecurityService}
        ]
      });
    });

    function expectRequestToHaveAuthHeader(connection: MockConnection) {
      expect(connection.request.headers.get('Authorization')).toContain('Bearer ' + tokenJson.access_token);
      connection.mockRespond(new Response(new ResponseOptions({body: {test: 'test'}})));
    }

    it('should http get with token', async(inject([AuthHttp, MockBackend], (authHttp: AuthHttp, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(expectRequestToHaveAuthHeader);
      authHttp.get('some url').subscribe(res => expect(res.json().test).toBe('test'), () => fail('get should not fail'));
    })));

    it('should http post with token', async(inject([AuthHttp, MockBackend], (authHttp: AuthHttp, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(expectRequestToHaveAuthHeader);
      authHttp.post('some url', 'test').subscribe(res => expect(res.json().test).toBe('test'), () => fail('post should not fail'));
    })));

    it('should http put with token', async(inject([AuthHttp, MockBackend], (authHttp: AuthHttp, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(expectRequestToHaveAuthHeader);
      authHttp.put('some url', 'test').subscribe(res => expect(res.json().test).toBe('test'), () => fail('put should not fail'));
    })));

    it('should http delete with token', async(inject([AuthHttp, MockBackend], (authHttp: AuthHttp, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(expectRequestToHaveAuthHeader);
      authHttp.delete('some url').subscribe(res => expect(res.json().test).toBe('test'), () => fail('delete should not fail'));
    })));

  });

  describe('with no token', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpModule, RouterTestingModule, RouterModule.forChild([])],
        providers: [
          AuthHttp,
          MockBackend,
          BaseRequestOptions,
          {
            provide: Http,
            useFactory: (backend, defaultOptions) => {
              return new Http(backend, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions]
          },
          {provide: SecurityService, useValue: {findAccessToken: () => Observable.empty()}}
        ]
      });
    });

    it('should not refresh http get without token', fakeAsync(inject([AuthHttp, MockBackend, Router],
      (authHttp: AuthHttp, mockBackend: MockBackend, router: Router) => {
        spyOn(router, 'navigate').and.returnValue(new Promise(() => true));
        authHttp.get('some url').subscribe(() => fail('should not emit'), () => fail('should handle error'), () => {
          expect(router.navigate).toHaveBeenCalledWith(['/login'], {queryParams: {from: 'unauthorized'}});
        });
      })));

    it('should not refresh http post without token', fakeAsync(inject([AuthHttp, MockBackend, Router],
      (authHttp: AuthHttp, mockBackend: MockBackend, router: Router) => {
        spyOn(router, 'navigate').and.returnValue(new Promise(() => true));
        authHttp.post('some url', 'test').subscribe(() => fail('should not emit'), () => fail('should handle error'), () => {
          expect(router.navigate).toHaveBeenCalledWith(['/login'], {queryParams: {from: 'unauthorized'}});
        });
      })));

    it('should not refresh http put without token', fakeAsync(inject([AuthHttp, MockBackend, Router],
      (authHttp: AuthHttp, mockBackend: MockBackend, router: Router) => {
        spyOn(router, 'navigate').and.returnValue(new Promise(() => true));
        authHttp.put('some url', 'test').subscribe(() => fail('should not emit'), () => fail('should handle error'), () => {
          expect(router.navigate).toHaveBeenCalledWith(['/login'], {queryParams: {from: 'unauthorized'}});
        });
      })));

    it('should not refresh http delete without token', fakeAsync(inject([AuthHttp, MockBackend, Router],
      (authHttp: AuthHttp, mockBackend: MockBackend, router: Router) => {
        spyOn(router, 'navigate').and.returnValue(new Promise(() => true));
        authHttp.delete('some url').subscribe(() => fail('should not emit'), () => fail('should handle error'), () => {
          expect(router.navigate).toHaveBeenCalledWith(['/login'], {queryParams: {from: 'unauthorized'}});
        });
      })));
  });

});
