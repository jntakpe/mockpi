import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { appConst } from '../shared/constants';
import '../shared/rxjs.extension';
import { Mock } from '../shared/api.model';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';

@Injectable()
export class MocksService {

  constructor(private http: Http, private router: Router, private mdSnackBar: MdSnackBar) {
  }

  findMocks(): Observable<Mock[]> {
    return this.http.get(`${appConst.api.baseUrl}/mocks`)
      .map(res => res.json())
      .map((m: Mock[]) => m.map(this.formatRequestParams));
  }

  save(mock: Mock, name?: string): Observable<Mock> {
    const req = name ? this.http.put(`${appConst.api.baseUrl}/mocks/${name}`, mock) : this.http.post(`${appConst.api.baseUrl}/mocks`, mock);
    return req.map(res => res.json());
  }

  remove({name}: Mock): Observable<void> {
    return this.http.delete(`${appConst.api.baseUrl}/mocks/${name}`)
      .map(res => res.json());
  }

  redirectMocks(): Observable<any> {
    return Observable.fromPromise(this.router.navigate(['/mocks'])).flatMap(() => Observable.empty());
  }

  mapKeyValueToLiteral(keyValueArray: Array<{ [key: string]: string }>): any {
    return keyValueArray
      .map(o => ({[o.key]: o.value}))
      .reduce((a, c) => Object.assign(a, c), {});
  }

  findByName(name: string): Observable<Mock> {
    return this.http.get(`${appConst.api.baseUrl}/mocks/${name}`)
      .map(res => res.json());
  }

  displaySaveError({status}: Response): void {
    if (status === 400) {
      this.mdSnackBar.open('Invalid fields error', appConst.snackBar.closeBtnLabel);
    } else {
      this.defaultServerError();
    }
  }

  displayRemoveError(name: string): Observable<any> {
    this.mdSnackBar.open(`Unable to remove mock with name ${name}`, appConst.snackBar.closeBtnLabel);
    return this.redirectMocks();
  }

  displayFindByNameError({status}: Response, name: string): Observable<any> {
    if (status === 404) {
      this.mdSnackBar.open(`Mock with name ${name} doesn't exist`, appConst.snackBar.closeBtnLabel);
    } else {
      this.defaultServerError();
    }
    return this.redirectMocks();
  }

  private formatRequestParams(mock: Mock): Mock {
    const params = mock.request.params;
    const urlSearchParams = new URLSearchParams();
    Object.keys(params).forEach(k => urlSearchParams.set(k, params[k]));
    mock.request['fmtParams'] = urlSearchParams.toString();
    return mock;
  }

  private defaultServerError(): void {
    this.mdSnackBar.open('Server error', appConst.snackBar.closeBtnLabel);
  }
}
