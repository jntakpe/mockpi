import { async, fakeAsync, inject, TestBed } from '@angular/core/testing';

import { LoginService } from './login.service';
import { SecurityService } from '../shared/security/security.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import '../shared/rxjs.extension';
import { User } from '../shared/security/user';
import { Router, Routes } from '@angular/router';
import { advance, createRoot, FakeHomeComponent, FakeLoginComponent, RootComponent } from '../shared/testing/testing-utils.spec';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Response, ResponseOptions } from '@angular/http';
import { appConst } from '../shared/constants';
import { MockpiMaterialModule } from '../shared/mockpi-material.module';

describe('LoginService', () => {

  @Component({
    template: `
      <div>Simple component</div>`,
  })
  class TestComponent {
  }

  const routes: Routes = [
    {path: '', component: RootComponent},
    {path: 'home', component: FakeHomeComponent},
    {path: 'login', component: FakeLoginComponent}
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, FakeHomeComponent, RootComponent, FakeLoginComponent],
      imports: [RouterTestingModule.withRoutes(routes), MockpiMaterialModule],
      providers: [LoginService, {
        provide: SecurityService,
        useValue: {login: (username, password) => Observable.of(new User('jntakpe', 'Joss', ['ADMIN']))}
      }]
    });
  });

  it('should create', inject([LoginService], (loginService: LoginService) => {
    expect(loginService).toBeTruthy();
  }));

  it('should login user', async(inject([LoginService, SecurityService], (loginService: LoginService, securityService: SecurityService) => {
    loginService.login('jntakpe', 'test').subscribe(user => {
      expect(user).toBeTruthy();
      expect(user.login).toBe('jntakpe');
    });
  })));

  it('should redirect to home page', fakeAsync(inject([LoginService, Router, Location],
    (loginService: LoginService, router: Router, location: Location) => {
      const fixture = createRoot(router, RootComponent);
      loginService.redirectHome();
      advance(fixture);
      expect(location.path()).toBe('/');
    })));

  it('should call display error message', fakeAsync(inject([LoginService, MdSnackBar],
    (loginService: LoginService, mdSnackBar: MdSnackBar) => {
      spyOn(mdSnackBar, 'open');
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      loginService.displayLoginErrorMsg(new Response(new ResponseOptions({status: 400})));
      expect(mdSnackBar.open).toHaveBeenCalledWith('Bad credentials', appConst.snackBar.closeBtnLabel);
    })));

  it('should call display default error message', fakeAsync(inject([LoginService, MdSnackBar],
    (loginService: LoginService, mdSnackBar: MdSnackBar) => {
      spyOn(mdSnackBar, 'open');
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      loginService.displayLoginErrorMsg(new Response(new ResponseOptions({status: 500})));
      expect(mdSnackBar.open).toHaveBeenCalledWith('General error', appConst.snackBar.closeBtnLabel);
    })));

});
