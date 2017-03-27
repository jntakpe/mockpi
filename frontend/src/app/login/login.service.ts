import { Injectable } from '@angular/core';
import { SecurityService } from '../shared/security/security.service';
import { Observable } from 'rxjs/Observable';
import '../shared/rxjs.extension';
import { User } from '../shared/security/user';
import { Router } from '@angular/router';
import { appConst } from '../shared/constants';
import { MdSnackBar } from '@angular/material';
import { Response } from '@angular/http';

@Injectable()
export class LoginService {

  constructor(private securityService: SecurityService, private router: Router, private mdSnackBar: MdSnackBar) {
  }

  login(username: string, password: string): Observable<User> {
    return this.securityService.login(username, password);
  }

  redirectHome(): Observable<boolean> {
    return Observable.fromPromise(this.router.navigate(['/']));
  }

  displayLoginErrorMsg({status}: Response): void {
    if (status === 400) {
      this.mdSnackBar.open('Bad credentials', appConst.snackBar.closeBtnLabel);
    } else {
      this.mdSnackBar.open('General error', appConst.snackBar.closeBtnLabel);
    }
  }
}
