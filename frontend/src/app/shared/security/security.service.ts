import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from './user';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { appConst } from '../constants';
import * as jwtDecode from 'jwt-decode';
import { OAuth2Response } from './oauth2-response.model';
import '../rxjs.extension';

@Injectable()
export class SecurityService {

  private _loginEvent: Subject<User> = new BehaviorSubject<User>(null);

  constructor(private http: Http, private localStorageService: LocalStorageService) {
  }

  login(username: string, password: string): Observable<User> {
    return this.accessTokenRequest(username, password)
      .map(res => res.json())
      .mergeMap((o: OAuth2Response) => this.localStorageService.saveOAuth2Response(o))
      .map(o => this.mapUser(o.access_token))
      .do(u => this._loginEvent.next(u));
  }

  listenLoginChanges(): Observable<User> {
    return this._loginEvent
      .mergeMap(u => u ? Observable.of(u) : this.loadUserFromLocalStorage());
  }

  logout(): Observable<void> {
    return this.localStorageService.removeToken()
      .do(() => this._loginEvent.next(null));
  }

  findAccessToken(): Observable<string> {
    return this.localStorageService.loadAccessToken()
      .defaultIfEmpty(false)
      .mergeMap(t => t ? Observable.of(t) : this.refresh().map(o => o.access_token));
  }

  private refresh(): Observable<OAuth2Response> {
    return this.localStorageService.loadRefreshToken()
      .mergeMap(r => this.refreshTokenRequest(r))
      .map(res => res.json())
      .catch(() => this.localStorageService.removeToken().mergeMap(() => Observable.empty()))
      .mergeMap((o: OAuth2Response) => this.localStorageService.saveOAuth2Response(o));
  }

  private loadUserFromLocalStorage(): Observable<User> {
    return this.localStorageService.loadAccessToken().map(t => this.mapUser(t)).defaultIfEmpty(null);
  }

  private accessTokenRequest(username: string, password: string): Observable<Response> {
    return this.http.post('/oauth/token', this.buildTokenRequestBody(username, password), this.buildTokenRequestOption());
  }

  private refreshTokenRequest(refreshToken: string): Observable<Response> {
    return this.http.post('/oauth/token', this.buildRefreshTokenRequestBody(refreshToken), this.buildTokenRequestOption());
  }

  private buildTokenRequestBody(username: string, password: string): string {
    return `username=${username}&password=${password}&grant_type=password&scope=${appConst.oauth2.scope}`
      + `&client_id=${appConst.oauth2.clientId}&client_secret=${appConst.oauth2.secret}`;
  }

  private buildRefreshTokenRequestBody(refreshToken: string): string {
    return `grant_type=refresh_token&refresh_token=${refreshToken}`;
  }

  private buildTokenRequestOption(): RequestOptionsArgs {
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Authorization': `Basic ${window.btoa(appConst.oauth2.clientId + ':' + appConst.oauth2.secret)}`
    });
    return {headers};
  }

  private mapUser(accessToken: string): User {
    const plainToken = jwtDecode(accessToken);
    return new User(plainToken.user_name, plainToken.full_name, plainToken.authorities);
  }

}
