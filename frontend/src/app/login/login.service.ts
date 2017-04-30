import {Injectable} from '@angular/core';
import {SecurityService} from '../shared/security/security.service';
import {Observable} from 'rxjs/Observable';
import '../shared/rxjs.extension';
import {User} from '../shared/security/user';
import {Router} from '@angular/router';
import {appConst} from '../shared/constants';
import {Response} from '@angular/http';
import {AlertService} from '../shared/alert/alert.service';

@Injectable()
export class LoginService {

  constructor(private securityService: SecurityService, private router: Router, private alertService: AlertService) {
  }

  login(username: string, password: string): Observable<User> {
    return this.securityService.login(username, password);
  }

  redirectHome(): Observable<boolean> {
    return Observable.fromPromise(this.router.navigate(['/']));
  }

  displayLoginErrorMsg({status}: Response): void {
    if (status === 400) {
      this.alertService.open('Bad credentials', appConst.snackBar.closeBtnLabel);
    } else {
      this.alertService.open('General error', appConst.snackBar.closeBtnLabel);
    }
  }
}
