import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Mock} from '../../shared/api.model';
import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {MocksService} from '../mocks.service';

@Injectable()
export class MockEditResolver implements Resolve<Mock> {

  constructor(private mocksService: MocksService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Mock> {
    const name = route.params.name;
    if (!name) {
      return Observable.of(null);
    }
    return this.mocksService.findByName(name)
      .catch(err => {
        this.mocksService.displayFindByNameError(err, name);
        this.mocksService.redirectMocks();
        return Observable.of(null);
      });
  }

}
