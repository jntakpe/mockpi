import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import '../shared/rxjs.extension';
import { Mock, Request } from '../shared/api.model';
import { Router } from '@angular/router';
import { FilterTableService } from '../shared/table/filter-table.service';
import { RegexType } from '../shared/table/regex-type';
import { AlertService } from '../shared/alert/alert.service';
import { environment } from '../../environments/environment';

@Injectable()
export class MocksService {

  private currentDuplicate: Mock;

  constructor(private http: Http,
              private router: Router,
              private alertService: AlertService,
              private filterTableService: FilterTableService) {
  }

  findFilteredMocks(search$: Observable<any>, refresh$: Observable<string>): Observable<Mock[]> {
    return Observable.combineLatest(search$, refresh$.mergeMap(() => this.findMocks()), (form, mocks) => ({form, mocks}))
      .map(({form, mocks}) => this.filterMocks(form, mocks));
  }

  findMocks(): Observable<Mock[]> {
    return this.http.get(`${environment.baseUrl}/mocks`)
      .map(res => res.json())
      .map((m: Mock[]) => m.map(this.formatRequestParams));
  }

  save(mock: Mock, id?: string): Observable<Mock> {
    const req = id ? this.http.put(`${environment.baseUrl}/mocks/${id}`, mock) : this.http.post(`${environment.baseUrl}/mocks`, mock);
    return req.map(res => res.json());
  }

  duplicate(mock: Mock): Observable<boolean> {
    return this.findDuplicateName(mock.name)
      .map(name => Object.assign(mock, {name}))
      .do(m => this.currentDuplicate = m)
      .flatMap(m => Observable.fromPromise(this.router.navigate(['/mock'], {queryParams: {duplicate: m.id}})));
  }

  retrieveCurrentDuplicate(): Mock {
    if (this.currentDuplicate) {
      const duplicate = Object.assign({}, this.currentDuplicate);
      this.currentDuplicate = null;
      return duplicate;
    }
  }

  remove({id}: Mock): Observable<void> {
    return this.http.delete(`${environment.baseUrl}/mocks/${id}`)
      .map(res => res.json());
  }

  redirectMocks(success?: string): Observable<any> {
    return Observable.fromPromise(this.router.navigate(['/mocks'])).flatMap(() => Observable.empty());
  }

  mapKeyValueToLiteral(keyValueArray: Array<{ [key: string]: string }>): any {
    return keyValueArray
      .map(o => ({[o.key]: o.value}))
      .reduce((a, c) => Object.assign(a, c), {});
  }

  findById(id: string): Observable<Mock> {
    return this.http.get(`${environment.baseUrl}/mocks/${id}`)
      .map(res => res.json());
  }

  checkNameAvailable(name: string, id?: string): Observable<string> {
    return this.http.post(`${environment.baseUrl}/mocks/name/available`, {name, id})
      .map(res => res.text());
  }

  checkRequestAvailable(request: Request, id?: string): Observable<Request> {
    return this.http.post(`${environment.baseUrl}/mocks/request/available`, {request, id})
      .map(res => res.json());
  }

  displaySaveSuccess(name: string, id: string): void {
    this.alertService.open(id ? `Mock ${name} successfully edited` : `Mock ${name} successfully created`);
  }

  displaySaveError({status}: Response): void {
    status === 400 ? this.alertService.open('Invalid fields error') : this.defaultServerError();
  }

  displayRemoveError(name: string): void {
    this.alertService.open(`Unable to remove mock with name ${name}`);
  }

  displayFindByErrorThenRedirect({status}: Response, name: string): Observable<any> {
    this.displayFindByNameError(status, name);
    return this.redirectMocks();
  }

  isApplicationJsonCompatible(mock: Mock): any {
    if (mock.response.contentType !== 'application/json') {
      return false;
    }
    try {
      return JSON.parse(mock.response.body);
    } catch (e) {
      return false;
    }
  }

  private displayFindByNameError(status: number, name: string): void {
    status === 404 ? this.alertService.open(`Mock named ${name} doesn't exist`) : this.defaultServerError();
  }

  private filterMocks(search: any, mocks: Mock[]): Mock[] {
    return this.filterTableService.regexFilter(mocks, search, RegexType.Contains);
  }

  private formatRequestParams(mock: Mock): Mock {
    const params = mock.request.params;
    const urlSearchParams = new URLSearchParams();
    Object.keys(params).forEach(k => urlSearchParams.set(k, params[k]));
    mock.request['fmtParams'] = urlSearchParams.toString();
    return mock;
  }

  private defaultServerError(): void {
    this.alertService.open('Server error');
  }

  private findDuplicateName(name: string): Observable<string> {
    return this.http.get(`${environment.baseUrl}/mocks/${name}/available`)
      .map(res => res.text())
      .catch(err => {
        this.displayFindByNameError(err.status, name);
        return Observable.empty();
      });
  }
}
