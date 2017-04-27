import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Mock } from '../../shared/api.model';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { MocksService } from '../mocks.service';

@Injectable()
export class MockEditResolver implements Resolve<Mock> {

  constructor(private mocksService: MocksService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Mock> {
    return route.params.name ? this.findByName(route.params.name) : Observable.of(null);
  }

  private findByName(name: any) {
    return this.mocksService.findByName(name).catch(e => this.mocksService.displayFindByErrorThenRedirect(e, name));
  }

}
