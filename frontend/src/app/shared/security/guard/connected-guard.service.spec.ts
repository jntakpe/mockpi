import {async, fakeAsync, inject, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ConnectedGuard} from './connected-guard.service';
import {SecurityService} from '../security.service';
import {Observable} from 'rxjs';
import {Router, Routes} from '@angular/router';
import {advance, createRoot, FakeHomeComponent, FakeLoginComponent, RootComponent} from '../../testing/testing-utils.spec';
import {Location} from '@angular/common';

const routes: Routes = [
  {path: '', component: RootComponent},
  {path: 'home', component: FakeHomeComponent},
  {path: 'login', component: FakeLoginComponent}
];

describe('connected guard service', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FakeHomeComponent, RootComponent, FakeLoginComponent],
      imports: [RouterTestingModule.withRoutes(routes)],
      providers: [
        ConnectedGuard,
        {provide: SecurityService, useValue: {listenLoginChanges: () => Observable.of({})}}
      ]
    });
  });

  it('should authorize access', async(inject([SecurityService, Router, ConnectedGuard],
    (securityService: SecurityService, router: Router, connectedGuard: ConnectedGuard) => {
      spyOn(securityService, 'listenLoginChanges').and.returnValue(Observable.of({some: 'obj'}));
      spyOn(router, 'navigate');
      connectedGuard.canActivateChild(null, null).subscribe(val => {
        expect(val).toBeTruthy();
        expect(router.navigate).toHaveBeenCalledTimes(0);
      });
    })));

  it('should not authorize access', async(inject([SecurityService, Router, ConnectedGuard],
    (securityService: SecurityService, router: Router, connectedGuard: ConnectedGuard) => {
      spyOn(securityService, 'listenLoginChanges').and.returnValue(Observable.of(null));
      spyOn(router, 'navigate').and.returnValue(Observable.of(true));
      connectedGuard.canActivateChild(null, null).subscribe(val => {
        expect(val).toBeFalsy();
        expect(router.navigate).toHaveBeenCalledTimes(1);
      });
    })));

  it('should redirect when refusing access', fakeAsync(inject([SecurityService, Router, ConnectedGuard, Location],
    (securityService: SecurityService, router: Router, connectedGuard: ConnectedGuard, location: Location) => {
      const fixture = createRoot(router, RootComponent);
      spyOn(securityService, 'listenLoginChanges').and.returnValue(Observable.of(null));
      connectedGuard.canActivateChild(null, null).subscribe(val => {
        expect(val).toBeFalsy();
        advance(fixture);
        expect(location.path()).toBe('/login');
      });
    })));

});
