import {async, fakeAsync, inject, TestBed} from '@angular/core/testing';
import {HeaderService} from './header.service';
import {SecurityService} from '../../security/security.service';
import {Observable} from 'rxjs';
import {User} from '../../security/user';
import {RouterTestingModule} from '@angular/router/testing';
import {advance, createRoot, FakeHomeComponent, FakeLoginComponent, RootComponent} from '../../testing/testing-utils.spec';
import {Router, Routes} from '@angular/router';
import {Location} from '@angular/common';

const routes: Routes = [
  {path: '', component: RootComponent},
  {path: 'home', component: FakeHomeComponent},
  {path: 'login', component: FakeLoginComponent}
];

describe('HeaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FakeHomeComponent, RootComponent, FakeLoginComponent],
      imports: [RouterTestingModule.withRoutes(routes)],
      providers: [HeaderService, {
        provide: SecurityService,
        useValue: {listenLoginChanges: () => Observable.of(new User('jntakpe', 'Joss', ['ADMIN'])), logout: () => Observable.of()}
      }]
    });
  });

  it('should create service', inject([HeaderService], (headerService: HeaderService) => {
    expect(headerService).toBeTruthy();
  }));

  it('should return username', async(inject([HeaderService], (headerService: HeaderService) => {
    headerService.username().subscribe(login => expect(login).toBe('jntakpe'));
  })));

  it('should handle null user', async(inject([HeaderService, SecurityService],
    (headerService: HeaderService, securityService: SecurityService) => {
      spyOn(securityService, 'listenLoginChanges').and.returnValue(Observable.of(null));
      headerService.username().subscribe(() => fail('should be filtered'), () => fail('should handle nulls'),
        () => expect(securityService.listenLoginChanges).toHaveBeenCalled());
    })));

  it('should logout user and redirect to login page', fakeAsync(inject([HeaderService, SecurityService, Router, Location],
    (headerService: HeaderService, securityService: SecurityService, router: Router, location: Location) => {
      const fixture = createRoot(router, RootComponent);
      spyOn(securityService, 'logout').and.returnValue(Observable.of());
      headerService.logoutThenRedirectHome().subscribe(() => {
        advance(fixture);
        expect(securityService.logout).toHaveBeenCalledTimes(1);
        expect(location.path()).toBe('/login');
      });
    })));

});
