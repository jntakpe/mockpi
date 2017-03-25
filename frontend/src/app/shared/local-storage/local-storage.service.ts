import * as localforage from 'localforage';
import * as moment from 'moment';
import {appConst} from '../constants';
import {Injectable} from '@angular/core';
import {OAuth2Response} from '../security/oauth2-response.model';
import {Observable} from 'rxjs';

@Injectable()
export class LocalStorageService {

  private tokenStore: LocalForage;

  constructor() {
    this.tokenStore = localforage.createInstance({
      name: appConst.localstorage.token.store
    });
  }

  saveOAuth2Response(oauth2Response: OAuth2Response): Observable<OAuth2Response> {
    oauth2Response.expires_at = this.calcExpirationDate(oauth2Response.expires_in);
    return Observable.fromPromise(this.tokenStore.setItem(appConst.localstorage.token.key, oauth2Response));
  }

  loadAccessToken(): Observable<string> {
    return Observable.fromPromise(this.tokenStore.getItem(appConst.localstorage.token.key))
      .filter(r => !!r)
      .mergeMap((r: OAuth2Response) => this.isTokenValid(r) ? Observable.of(r) : this.removeExpiredToken())
      .map(r => r.access_token)
  }

  removeToken(): Observable<void> {
    return Observable.fromPromise(this.tokenStore.removeItem(appConst.localstorage.token.key));
  }

  private isTokenValid(response: OAuth2Response): boolean {
    return response && moment().isBefore(moment(response.expires_at));
  }

  private calcExpirationDate(expiresIn: number) {
    return moment().add(expiresIn, 's').toDate();
  }

  private removeExpiredToken(): Observable<any> {
    return this.removeToken().flatMap(() => Observable.empty());
  }

}
