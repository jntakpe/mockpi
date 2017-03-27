import { Injectable } from '@angular/core';
import { SecurityService } from '../../../security/security.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import '../../../rxjs.extension';

@Injectable()
export class NavSignService {

  constructor(private securityService: SecurityService, private router: Router) {
  }

  username(): Observable<string> {
    return this.securityService.listenLoginChanges()
      .filter(u => !!u)
      .map(u => u.login);
  }

  logoutThenRedirectHome(): Observable<boolean> {
    return this.securityService.logout()
      .flatMap(() => Observable.fromPromise(this.router.navigate(['/login'])));
  }

}
