import { async, fakeAsync, inject, TestBed } from '@angular/core/testing';
import { SecurityService } from '../../../security/security.service';
import { Observable } from 'rxjs/Observable';
import '../../../rxjs.extension';
import { User } from '../../../security/user';
import { RouterTestingModule } from '@angular/router/testing';
import { advance, createRoot, FakeHomeComponent, FakeLoginComponent, RootComponent } from '../../../testing/testing-utils.spec';
import { Router, Routes } from '@angular/router';
import { Location } from '@angular/common';
import { NavSignService } from './nav-sign.service';

const routes: Routes = [
  {path: '', component: RootComponent},
  {path: 'home', component: FakeHomeComponent},
  {path: 'login', component: FakeLoginComponent}
];

describe('NavSignService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FakeHomeComponent, RootComponent, FakeLoginComponent],
      imports: [RouterTestingModule.withRoutes(routes)],
      providers: [NavSignService, {
        provide: SecurityService,
        useValue: {listenLoginChanges: () => Observable.of(new User('jntakpe', 'Joss', ['ADMIN'])), logout: () => Observable.of()}
      }]
    });
  });

  it('should create service', inject([NavSignService], (headerService: NavSignService) => {
    expect(headerService).toBeTruthy();
  }));

  it('should return username', async(inject([NavSignService], (headerService: NavSignService) => {
    headerService.username().subscribe(login => expect(login).toBe('jntakpe'));
  })));

  it('should handle null user', async(inject([NavSignService, SecurityService],
    (headerService: NavSignService, securityService: SecurityService) => {
      spyOn(securityService, 'listenLoginChanges').and.returnValue(Observable.of(null));
      headerService.username().subscribe(() => fail('should be filtered'), () => fail('should handle nulls'),
        () => expect(securityService.listenLoginChanges).toHaveBeenCalled());
    })));

  it('should logout user and redirect to login page', fakeAsync(inject([NavSignService, SecurityService, Router, Location],
    (headerService: NavSignService, securityService: SecurityService, router: Router, location: Location) => {
      const fixture = createRoot(router, RootComponent);
      spyOn(securityService, 'logout').and.returnValue(Observable.of());
      headerService.logoutThenRedirectHome().subscribe(() => {
        advance(fixture);
        expect(securityService.logout).toHaveBeenCalledTimes(1);
        expect(location.path()).toBe('/login');
      });
    })));

});
