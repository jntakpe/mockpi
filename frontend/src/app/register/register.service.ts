import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { User } from '../shared/api.model';
import { Observable } from 'rxjs/Observable';
import { appConst } from '../shared/constants';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import '../shared/rxjs.extension';

@Injectable()
export class RegisterService {

  constructor(private http: Http, private router: Router, private mdSnackBar: MdSnackBar) {
  }

  register(user: User, password: String): Observable<User> {
    return this.http.post(`${appConst.api.baseUrl}/users`, Object.assign(user, {password}))
      .map(res => res.json())
      .flatMap(u => this.redirectToLoginPage(u))
      .catch(() => this.handleError());
  }

  private redirectToLoginPage(user: User): Observable<User> {
    return Observable.fromPromise(this.router.navigate(['/login']))
      .do(() => this.mdSnackBar.open(`User ${user.username} registered`))
      .map(() => user);
  }

  private handleError(): Observable<any> {
    this.mdSnackBar.open('Error during registration', appConst.snackBar.closeBtnLabel);
    return Observable.empty();
  }

}
