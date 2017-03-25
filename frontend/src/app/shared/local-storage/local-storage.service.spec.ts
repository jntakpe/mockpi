import {LocalStorageService} from './local-storage.service';
import {async, inject, TestBed} from '@angular/core/testing';
import {OAuth2Response} from '../security/oauth2-response.model';
import {appConst} from '../constants';
import moment = require('moment');
import StartOf = moment.unitOfTime.StartOf;

describe('local storage service', () => {

  const oauth2Response: OAuth2Response = {
    access_token: 'at',
    refresh_token: 'rt',
    expires_in: 60
  };

  let localStorageService: LocalStorageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageService]
    });
  }));

  beforeEach(async(inject([LocalStorageService], (lsService: LocalStorageService) => {
    localStorageService = lsService;
  })));

  it('should save oauth2 response', done => {
    localStorageService.saveOAuth2Response(oauth2Response).subscribe(o => {
      expect(o).toBeTruthy();
      const tokenStore = localStorageService['tokenStore'];
      tokenStore.getItem(appConst.localstorage.token.key).then(r => {
        expect(r).toBeTruthy();
        return tokenStore.removeItem(appConst.localstorage.token.key).then(() => done());
      });
    });
  });

  it('should save oauth2 response with expires_at initialized', done => {
    localStorageService.saveOAuth2Response(oauth2Response).subscribe(o => {
      expect(o.expires_at).toBeTruthy();
      expect(moment(o.expires_at).subtract(oauth2Response.expires_in).isSame(moment(), 's'));
      const tokenStore = localStorageService['tokenStore'];
      tokenStore.getItem(appConst.localstorage.token.key).then(r => {
        return tokenStore.removeItem(appConst.localstorage.token.key).then(() => done());
      });
    });
  });

  it('should load access token', done => {
    localStorageService.saveOAuth2Response(oauth2Response).subscribe(() => {
      localStorageService.loadAccessToken().subscribe(a => {
        expect(a).toBeTruthy();
        localStorageService['tokenStore'].removeItem(appConst.localstorage.token.key).then(() => done());
      });
    });
  });

  it('should not load access token cuz expired', done => {
    oauth2Response.expires_in = -1;
    localStorageService.saveOAuth2Response(oauth2Response).subscribe(() => {
      localStorageService.loadAccessToken().subscribe(
        () => fail('should not success cuz expired'),
        () => fail('should complete'),
        () => done());
    });
  });

  it('should not load access token cuz missing', done => {
    spyOn(localStorageService, 'isTokenValid');
    const tokenStore = localStorageService['tokenStore'];
    tokenStore.removeItem(appConst.localstorage.token.key).then(() => {
      localStorageService.loadAccessToken().subscribe(
        () => fail('should not success cuz expired'),
        () => fail('should complete'),
        () => {
          expect(localStorageService['isTokenValid']).toHaveBeenCalledTimes(0);
          done();
        });
    });
  });

  it('should remove token if exist', done => {
    const tokenStore = localStorageService['tokenStore'];
    tokenStore.setItem(appConst.localstorage.token.key, oauth2Response)
      .then(() => tokenStore.getItem(appConst.localstorage.token.key), () => fail('should save response'))
      .then(response => {
        expect(response).toBeTruthy();
        localStorageService.removeToken().subscribe(() => {
          tokenStore.getItem(appConst.localstorage.token.key).then(response => {
            expect(response).toBeFalsy();
            done();
          }, () => fail('remove should succeed'))
        });
      }, () => fail('should get response'));
  });

  it('should try to remove not existing token', done => {
    const tokenStore = localStorageService['tokenStore'];
    tokenStore.getItem(appConst.localstorage.token.key).then(response => {
      expect(response).toBeFalsy();
      localStorageService.removeToken().subscribe(() => {
        tokenStore.getItem(appConst.localstorage.token.key).then(response => {
          expect(response).toBeFalsy();
          done();
        }, () => fail('remove should succeed'))
      });
    });
  });

});
