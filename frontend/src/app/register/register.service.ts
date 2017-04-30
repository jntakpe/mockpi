import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {User} from '../shared/api.model';
import {Observable} from 'rxjs/Observable';
import {appConst} from '../shared/constants';
import {Router} from '@angular/router';
import '../shared/rxjs.extension';
import {AlertService} from '../shared/alert/alert.service';

@Injectable()
export class RegisterService {

  constructor(private http: Http, private router: Router, private alertService: AlertService) {
  }

  register(user: User, password: String): Observable<User> {
    return this.http.post(`${appConst.api.baseUrl}/users`, Object.assign(user, {password}))
      .map(res => res.json())
      .flatMap(u => this.redirectToLoginPage(u))
      .catch(() => this.handleError());
  }

  private redirectToLoginPage(user: User): Observable<User> {
    return Observable.fromPromise(this.router.navigate(['/login']))
      .do(() => this.alertService.open(`User ${user.username} registered`))
      .map(() => user);
  }

  private handleError(): Observable<any> {
    this.alertService.open('Error during registration');
    return Observable.empty();
  }

}
