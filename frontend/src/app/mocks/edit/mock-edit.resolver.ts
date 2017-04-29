import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Mock} from '../../shared/api.model';
import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {MocksService} from '../mocks.service';

@Injectable()
export class MockEditResolver implements Resolve<Mock> {

  constructor(private mocksService: MocksService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Mock> {
    return route.params.id ? this.findById(route.params.id) : Observable.of(null);
  }

  private findById(id: any) {
    return this.mocksService.findById(id).catch(e => this.mocksService.displayFindByErrorThenRedirect(e, id));
  }

}
