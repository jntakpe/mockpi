import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { User } from '../shared/api.model';
import { Observable } from 'rxjs/Observable';
import { appConst } from '../shared/constants';

@Injectable()
export class RegisterService {

  constructor(private http: Http) {
  }

  register(user: User): Observable<User> {
    return this.http.post(`${appConst.api.baseUrl}/users`, user)
      .map(res => res.json());
  }

}
