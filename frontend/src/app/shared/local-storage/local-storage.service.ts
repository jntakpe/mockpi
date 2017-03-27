import * as localforage from 'localforage';
import * as moment from 'moment';
import * as jwtDecode from 'jwt-decode';
import { appConst } from '../constants';
import { Injectable } from '@angular/core';
import { OAuth2Response } from '../security/oauth2-response.model';
import { Observable } from 'rxjs/Observable';
import '../rxjs.extension';

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
    return this.loadResponse()
      .mergeMap(r => this.isAccessTokenValid(r) ? Observable.of(r) : this.removeExpiredToken())
      .map(r => r.access_token);
  }

  loadRefreshToken(): Observable<string> {
    return this.loadResponse()
      .map(r => r.refresh_token)
      .filter(t => this.isRefreshTokenValid(t));
  }

  removeToken(): Observable<void> {
    return Observable.fromPromise(this.tokenStore.removeItem(appConst.localstorage.token.key));
  }

  private loadResponse(): Observable<OAuth2Response> {
    return Observable.fromPromise(this.tokenStore.getItem(appConst.localstorage.token.key))
      .filter(r => !!r);
  }

  private isAccessTokenValid(response: OAuth2Response): boolean {
    return response && moment().isBefore(moment(response.expires_at));
  }

  private isRefreshTokenValid(refreshToken: string): boolean {
    if (refreshToken) {
      const token = this.decodeToken(refreshToken);
      if (token && token.exp) {
        return moment().isBefore(moment(token.exp));
      }
    }
    return false;
  }

  private calcExpirationDate(expiresIn: number) {
    return moment().add(expiresIn, 's').toDate();
  }

  private removeExpiredToken(): Observable<any> {
    return this.removeToken().flatMap(() => Observable.empty());
  }

  private decodeToken(refreshToken: string): any {
    return jwtDecode(refreshToken);
  }

}
