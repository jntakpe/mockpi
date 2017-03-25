import {ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {SecurityService} from '../security.service';

@Injectable()
export class ConnectedGuard implements CanActivateChild {

  constructor(private securityService: SecurityService, private router: Router) {
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.securityService.listenLoginChanges()
      .filter(u => !u)
      .do(l => this.router.navigate(['/login']))
      .defaultIfEmpty(true);
  }

}
