import {inject, TestBed} from '@angular/core/testing';

import {SecurityService} from './security.service';
import {MockBackend} from '@angular/http/testing';
import {BaseRequestOptions, Http, HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {LocalStorageService} from '../local-storage/local-storage.service';
import {mockTokenResponse, tokenJson} from '../testing/testing-utils.spec';
import {Observable} from 'rxjs';
import {User} from './user';

describe('SecurityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, RouterTestingModule, RouterModule.forChild([])],
      providers: [
        SecurityService,
        LocalStorageService,
        MockBackend,
        BaseRequestOptions,
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

  it('should extract user from token', inject([SecurityService, MockBackend, LocalStorageService],
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
    }));

  it('should listen to user changes and observe user from localstorage', inject([SecurityService, LocalStorageService],
    (securityService: SecurityService, localStorageService: LocalStorageService) => {
      spyOn(localStorageService, 'loadAccessToken').and.returnValue(Observable.of(tokenJson['access_token']));
      securityService.listenLoginChanges().subscribe(user => {
          expect(user).toBeTruthy();
          expect(localStorageService.loadAccessToken).toHaveBeenCalled()
        },
        () => fail('should observe event'))
    }));

  it('should listen to user changes and observe user from memory', inject([SecurityService, MockBackend, LocalStorageService],
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
    }));

  it('should listen to user changes and observe nothing', inject([SecurityService, MockBackend, LocalStorageService],
    (securityService: SecurityService, mockBackend: MockBackend, localStorageService: LocalStorageService) => {
      spyOn(localStorageService, 'loadAccessToken').and.returnValue(Observable.empty());
      securityService.listenLoginChanges().subscribe(
        val => expect(val).toBeNull(),
        () => fail('should complete'),
        () => expect(localStorageService.loadAccessToken).toHaveBeenCalled());
    }));

  it('should logout user', inject([SecurityService, LocalStorageService],
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
    }));

});
