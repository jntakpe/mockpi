import { async, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

import { RegisterService } from './register.service';
import { Component } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { advance, createRoot, FakeHomeComponent, FakeLoginComponent, RootComponent } from '../shared/testing/testing-utils.spec';
import { MaterialModule, MdSnackBar } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions, Http, Response, ResponseOptions } from '@angular/http';
import { appConst } from '../shared/constants';
import { User } from '../shared/api.model';
import { Location } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const user: User = {
  username: 'jntakpe',
  name: 'Joss',
  email: 'jntakpe@mail.com'
};

describe('RegisterService', () => {

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
      imports: [RouterTestingModule.withRoutes(routes), MaterialModule, BrowserAnimationsModule],
      providers: [
        RegisterService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, defaultOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        }
      ],
    });
  });

  it('should create', inject([RegisterService], (service: RegisterService) => {
    expect(service).toBeTruthy();
  }));

  it('should register user', async(inject([RegisterService, MockBackend, Router],
    (service: RegisterService, mockBackend: MockBackend, router: Router) => {
      spyOn(router, 'navigate').and.returnValue(new Promise(() => true));
      mockBackend.connections.subscribe(c => mockRegisterResponse(c));
      service.register(user, 'pwd').subscribe(u => {
        expect(user).toBeTruthy();
        expect(user.username).toEqual('jntakpe');
      });
    })));

  it('should call snackBar', async(inject([RegisterService, MockBackend, Router, MdSnackBar],
    (service: RegisterService, mockBackend: MockBackend, router: Router, mdSnackBar: MdSnackBar) => {
      spyOn(router, 'navigate').and.returnValue(new Promise(() => true));
      spyOn(mdSnackBar, 'open');
      mockBackend.connections.subscribe(c => mockRegisterResponse(c));
      service.register(user, 'pwd').subscribe(u => expect(mdSnackBar.open).toHaveBeenCalledWith(`User ${u.username} registered`));
    })));

  it('should redirect to login', fakeAsync(inject([RegisterService, MockBackend, Router, MdSnackBar, Location],
    (service: RegisterService, mockBackend: MockBackend, router: Router, mdSnackBar: MdSnackBar, location: Location) => {
      const fixture = createRoot(router, RootComponent);
      mockBackend.connections.subscribe(c => mockRegisterResponse(c));
      service.register(user, 'pwd').subscribe();
      tick(100);
      advance(fixture);
      expect(location.path()).toBe('/login');
    })));

  function mockRegisterResponse(connection: MockConnection) {
    expect(connection.request.url).toEqual(`${appConst.api.baseUrl}/users`);
    const userPwd = user;
    userPwd['password'] = 'pwd';
    expect(JSON.parse(connection.request.getBody())).toEqual(userPwd);
    connection.mockRespond(new Response(new ResponseOptions({
      body: user
    })));
  }

});

