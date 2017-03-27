import { async, inject, TestBed } from '@angular/core/testing';

import { SecurityService } from './security.service';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { mockRefreshTokenResponse, mockTokenResponse, tokenJson } from '../testing/testing-utils.spec';
import { Observable } from 'rxjs';
import { User } from './user';
import { MockLocalStorageService } from '../local-storage/local-storage.service.spec';

export class MockSecurityService extends SecurityService {

  constructor() {
    super(null, null)
  }

  login(username: string, password: string): Observable<User> {
    return Observable.of(new User('jntakpe', 'Joss', ['ADMIN']));
  }

  listenLoginChanges(): Observable<User> {
    return Observable.of(new User('jntakpe', 'Joss', ['ADMIN']));
  }

  logout(): Observable<void> {
    return Observable.of(null);
  }

  findAccessToken(): Observable<string> {
    return Observable.of(tokenJson['access_token']);
  }
}

describe('SecurityService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, RouterTestingModule, RouterModule.forChild([])],
      providers: [
        SecurityService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: LocalStorageService,
          useClass: MockLocalStorageService
        },
        {
          provide: Http,
          useFactory: (backend, defaultOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should create', inject([SecurityService], (securityService: SecurityService) => {
    expect(securityService).toBeTruthy();
  }));

  it('should extract user from token', async(inject([SecurityService, MockBackend, LocalStorageService],
    (securityService: SecurityService, mockBackend: MockBackend, localStorageService: LocalStorageService) => {
      spyOn(localStorageService, 'saveOAuth2Response').and.returnValue(Observable.of(tokenJson));
      mockBackend.connections.subscribe(c => mockTokenResponse(c));
      securityService.login('jntakpe', 'test').subscribe(user => {
        expect(user).toBeTruthy();
        expect(user.login).toBe('jntakpe');
        expect(user.authorities).toContain('USER');
        expect(user.authorities).toContain('ADMIN');
        expect(localStorageService.saveOAuth2Response).toHaveBeenCalled();
      }, () => fail(`should get token`));
    })));

  it('should listen to user changes and observe user from localstorage', async(inject([SecurityService, LocalStorageService],
    (securityService: SecurityService, localStorageService: LocalStorageService) => {
      spyOn(localStorageService, 'loadAccessToken').and.returnValue(Observable.of(tokenJson['access_token']));
      securityService.listenLoginChanges().subscribe(user => {
          expect(user).toBeTruthy();
          expect(localStorageService.loadAccessToken).toHaveBeenCalled()
        },
        () => fail('should observe event'))
    })));

  it('should listen to user changes and observe user from memory', async(inject([SecurityService, MockBackend, LocalStorageService],
    (securityService: SecurityService, mockBackend: MockBackend, localStorageService: LocalStorageService) => {
      spyOn(localStorageService, 'saveOAuth2Response').and.returnValue(Observable.of(tokenJson));
      mockBackend.connections.subscribe(c => mockTokenResponse(c));
      securityService.login('jntakpe', 'test').subscribe(() => {
        spyOn(localStorageService, 'loadAccessToken');
        securityService.listenLoginChanges().subscribe(user => {
            expect(user).toBeTruthy();
            expect(localStorageService.loadAccessToken).not.toHaveBeenCalled();
          },
          () => fail('should observe event'))
      });
    })));

  it('should listen to user changes and observe nothing', async(inject([SecurityService, MockBackend, LocalStorageService],
    (securityService: SecurityService, mockBackend: MockBackend, localStorageService: LocalStorageService) => {
      spyOn(localStorageService, 'loadAccessToken').and.returnValue(Observable.empty());
      securityService.listenLoginChanges().subscribe(
        val => expect(val).toBeNull(),
        () => fail('should complete'),
        () => expect(localStorageService.loadAccessToken).toHaveBeenCalled());
    })));

  it('should logout user', async(inject([SecurityService, LocalStorageService],
    (securityService: SecurityService, localStorageService: LocalStorageService) => {
      spyOn(localStorageService, 'removeToken').and.returnValue(Observable.of());
      const spy = jasmine.createSpy('spy');
      let currentUser: User = null;
      securityService.listenLoginChanges().subscribe(user => {
        currentUser = user;
        spy(user);
      }, err => fail(err), () => {
        expect(localStorageService.removeToken).toHaveBeenCalledTimes(1);
        expect(currentUser).toBeNull();
        expect(spy.calls.first().object).toBeNull();
        expect(spy.calls.mostRecent().object).toBeNull();
      });
    })));

  it('should find access token from localstorage', async(inject([SecurityService, LocalStorageService],
    (securityService: SecurityService, localStorageService: LocalStorageService) => {
      spyOn(localStorageService, 'loadAccessToken').and.returnValue(Observable.of(tokenJson['access_token']));
      spyOn(localStorageService, 'loadRefreshToken');
      spyOn(localStorageService, 'removeToken');
      securityService.findAccessToken().subscribe(token => {
        expect(token).toBeTruthy();
        expect(localStorageService.loadAccessToken).toHaveBeenCalled();
        expect(localStorageService.loadRefreshToken).toHaveBeenCalledTimes(0);
        expect(localStorageService.removeToken).toHaveBeenCalledTimes(0);
      });
    })));

  it('should find access token with refresh', async(inject([SecurityService, LocalStorageService, MockBackend],
    (securityService: SecurityService, localStorageService: LocalStorageService, mockBackend: MockBackend) => {
      spyOn(localStorageService, 'loadAccessToken').and.returnValue(Observable.empty());
      spyOn(localStorageService, 'loadRefreshToken').and.returnValue(Observable.of(tokenJson['refresh_token']));
      spyOn(localStorageService, 'removeToken');
      mockBackend.connections.subscribe(c => mockRefreshTokenResponse(c));
      securityService.findAccessToken().subscribe(
        token => {
          expect(token).toBeTruthy();
          expect(localStorageService.loadAccessToken).toHaveBeenCalled();
          expect(localStorageService.loadRefreshToken).toHaveBeenCalled();
          expect(localStorageService.removeToken).toHaveBeenCalledTimes(0);
        },
        () => fail('should not throw error'));
    })));

  it('should not find access token cuz no refresh', async(inject([SecurityService, LocalStorageService],
    (securityService: SecurityService, localStorageService: LocalStorageService) => {
      spyOn(localStorageService, 'loadAccessToken').and.returnValue(Observable.empty());
      spyOn(localStorageService, 'loadRefreshToken').and.returnValue(Observable.empty());
      spyOn(localStorageService, 'removeToken');
      securityService.findAccessToken().subscribe(
        () => fail('should not call onNext'),
        () => fail('should not throw error'),
        () => {
          expect(localStorageService.loadAccessToken).toHaveBeenCalled();
          expect(localStorageService.loadRefreshToken).toHaveBeenCalled();
          expect(localStorageService.removeToken).toHaveBeenCalledTimes(0);
        });
    })));

  it('should not find access token cuz invalid refresh', async(inject([SecurityService, LocalStorageService, MockBackend],
    (securityService: SecurityService, localStorageService: LocalStorageService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(c => c.mockError(new Response(new ResponseOptions({status: 401}))));
      spyOn(localStorageService, 'loadAccessToken').and.returnValue(Observable.empty());
      spyOn(localStorageService, 'loadRefreshToken').and.returnValue(Observable.of(tokenJson['refresh_token']));
      spyOn(localStorageService, 'removeToken').and.returnValue(Observable.of());
      securityService.findAccessToken().subscribe(
        () => fail('should not call onNext'),
        () => fail('error should be catched'),
        () => {
          expect(localStorageService.loadAccessToken).toHaveBeenCalled();
          expect(localStorageService.loadRefreshToken).toHaveBeenCalled();
          expect(localStorageService.removeToken).toHaveBeenCalled();
        });
    })));

});
