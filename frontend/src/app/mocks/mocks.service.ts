import {Injectable} from '@angular/core';
import {Http, Response, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {appConst} from '../shared/constants';
import '../shared/rxjs.extension';
import {Mock} from '../shared/api.model';
import {Router} from '@angular/router';
import {MdSnackBar} from '@angular/material';

@Injectable()
export class MocksService {

  constructor(private http: Http, private router: Router, private mdSnackBar: MdSnackBar) {
  }

  findMocks(): Observable<Mock[]> {
    return this.http.get(`${appConst.api.baseUrl}/mocks`)
      .map(res => res.json())
      .map((m: Mock[]) => m.map(this.formatRequestParams));
  }

  save(mock: any, name?: string): Observable<Mock> {
    const req = name ? this.http.put(`${appConst.api.baseUrl}/mocks/${name}`, mock) : this.http.post(`${appConst.api.baseUrl}/mocks`, mock);
    return req.map(res => res.json());
  }

  redirectMocks(): Observable<boolean> {
    return Observable.fromPromise(this.router.navigate(['/mocks']));
  }

  displaySaveError({status}: Response): void {
    if (status === 400) {
      this.mdSnackBar.open('Invalid fields error', appConst.snackBar.closeBtnLabel);
    } else {
      this.mdSnackBar.open('Server error', appConst.snackBar.closeBtnLabel);
    }
  }


  private formatRequestParams(mock: Mock): Mock {
    const params = mock.request.params;
    const urlSearchParams = new URLSearchParams();
    Object.keys(params).forEach(k => urlSearchParams.set(k, params[k]));
    mock.request['fmtParams'] = urlSearchParams.toString();
    return mock;
  }

}
