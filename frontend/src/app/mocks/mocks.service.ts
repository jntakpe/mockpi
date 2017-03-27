import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Mock } from 'protractor/built/driverProviders';
import { appConst } from '../shared/constants';

@Injectable()
export class MocksService {

  constructor(private http: Http) {
  }

  findMocks(): Observable<Mock[]> {
    return this.http.get(`${appConst.api.baseUrl}/mocks`)
      .map(res => res.json())
      .do(l => console.log(l));
  }

}
