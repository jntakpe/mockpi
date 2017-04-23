import {async, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';
import {MocksService} from './mocks.service';
import {MockBackend} from '@angular/http/testing';
import {BaseRequestOptions, Http, HttpModule, Response, ResponseOptions} from '@angular/http';
import {Mock} from '../shared/api.model';
import {Observable} from 'rxjs/Observable';
import {RouterTestingModule} from '@angular/router/testing';
import {MdSnackBar, MdSnackBarModule} from '@angular/material';
import {Router, Routes} from '@angular/router';
import {advance, createRoot, FakeFeatureComponent, FakeHomeComponent, RootComponent} from '../shared/testing/testing-utils.spec';
import {Location} from '@angular/common';
import {Component} from '@angular/core';
import {appConst} from '../shared/constants';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TableModule} from '../shared/table/table.module';


export const firstMock: Mock = {
  name: 'firstmock',
  request: {
    path: '/api/firstmock',
    method: 'GET',
    params: {},
    headers: {}
  },
  response: {
    body: 'firstBody',
    status: 200,
    contentType: 'application/json'
  },
  collection: 'default',
  delay: 10,
  description: 'My first mock'
};

const secondMock: Mock = {
  name: 'secondmock',
  request: {
    path: '/api/secondmock',
    method: 'GET',
    params: {},
    headers: {}
  },
  response: {
    body: 'secondBody',
    status: 200,
    contentType: 'application/json'
  },
  collection: 'default',
  delay: 10,
  description: 'My second mock'
};

export class FakeMocksService extends MocksService {

  constructor() {
    super(null, null, null, null);
  }

  findFilteredMocks(search$: Observable<any>, refresh$: Observable<any>): Observable<Mock[]> {
    return Observable.of([firstMock, secondMock]);
  }

  findMocks(): Observable<Mock[]> {
    return Observable.of([firstMock, secondMock]);
  }

  save(mock: any, name?: string): Observable<Mock> {
    return Observable.of(firstMock);
  }

  remove({name}: Mock): Observable<void> {
    return Observable.of(null);
  }

  redirectMocks(): Observable<boolean> {
    return Observable.of(true);
  }

  displaySaveError({status}: Response): void {
  }


  findByName(name): Observable<Mock> {
    return Observable.of(firstMock);
  }
}

describe('MocksService', () => {

  const routes: Routes = [
    {path: '', component: RootComponent},
    {path: 'home', component: FakeHomeComponent},
    {path: 'mocks', component: FakeFeatureComponent}
  ];

  @Component({
    template: `
      <div>Simple component</div>`,
  })
  class TestComponent {
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, RouterTestingModule.withRoutes(routes), MdSnackBarModule, TableModule],
      declarations: [RootComponent, FakeHomeComponent, FakeFeatureComponent, TestComponent],
      providers: [
        MocksService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, defaultOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should create mocks service', inject([MocksService], (service: MocksService) => {
    expect(service).toBeTruthy();
  }));

  it('should find mock array without filtering', async(inject([MocksService, MockBackend],
    (mocksService: MocksService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(c => c.mockRespond(new Response(new ResponseOptions({body: [firstMock, secondMock]}))));
      const search$ = new BehaviorSubject({}).asObservable();
      const refresh$ = new BehaviorSubject('start').asObservable();
      mocksService.findFilteredMocks(search$, refresh$).subscribe(mocks => {
        expect(mocks).toBeTruthy();
        expect(mocks.length).toBe(2);
      });
    })));

  it('should find mock array without filtering cuz empty fields', async(inject([MocksService, MockBackend],
    (mocksService: MocksService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(c => c.mockRespond(new Response(new ResponseOptions({body: [firstMock, secondMock]}))));
      const searchForm = {name: '', request: {path: '', method: '', fmtParams: ''}, response: {body: ''}};
      const search$ = new BehaviorSubject(searchForm).asObservable();
      const refresh$ = new BehaviorSubject('start').asObservable();
      mocksService.findFilteredMocks(search$, refresh$).subscribe(mocks => {
        expect(mocks).toBeTruthy();
        expect(mocks.length).toBe(2);
      });
    })));

  it('should find mock array filtering first with name', async(inject([MocksService, MockBackend],
    (mocksService: MocksService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(c => c.mockRespond(new Response(new ResponseOptions({body: [firstMock, secondMock]}))));
      const searchForm = {name: 'first', request: {path: '', method: '', fmtParams: ''}, response: {body: ''}};
      const search$ = new BehaviorSubject(searchForm).asObservable();
      const refresh$ = new BehaviorSubject('start').asObservable();
      mocksService.findFilteredMocks(search$, refresh$).subscribe(mocks => {
        expect(mocks).toBeTruthy();
        expect(mocks.length).toBe(1);
        expect(mocks[0].name).toEqual(firstMock.name);
      });
    })));

  it('should find mock array filtering first with request path and method', async(inject([MocksService, MockBackend],
    (mocksService: MocksService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(c => c.mockRespond(new Response(new ResponseOptions({body: [firstMock, secondMock]}))));
      const searchForm = {name: '', request: {path: 'first', method: 'GET', fmtParams: ''}, response: {body: ''}};
      const search$ = new BehaviorSubject(searchForm).asObservable();
      const refresh$ = new BehaviorSubject('start').asObservable();
      mocksService.findFilteredMocks(search$, refresh$).subscribe(mocks => {
        expect(mocks).toBeTruthy();
        expect(mocks.length).toBe(1);
        expect(mocks[0].name).toEqual(firstMock.name);
      });
    })));

  it('should find mock array filtering missing all', async(inject([MocksService, MockBackend],
    (mocksService: MocksService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(c => c.mockRespond(new Response(new ResponseOptions({body: [firstMock, secondMock]}))));
      const searchForm = {name: '', request: {path: '', method: '', fmtParams: ''}, response: {body: 'unknownBody'}};
      const search$ = new BehaviorSubject(searchForm).asObservable();
      const refresh$ = new BehaviorSubject('start').asObservable();
      mocksService.findFilteredMocks(search$, refresh$).subscribe(mocks => {
        expect(mocks).toBeTruthy();
        expect(mocks.length).toBe(0);
      });
    })));

  it('should find mock and refresh when remove', fakeAsync(inject([MocksService, MockBackend],
    (mocksService: MocksService, mockBackend: MockBackend) => {
      let refreshed = false;
      mockBackend.connections.subscribe(c => {
        const single = new Response(new ResponseOptions({body: [firstMock]}));
        const couple = new Response(new ResponseOptions({body: [firstMock, secondMock]}));
        c.mockRespond(refreshed ? single : couple);
      });
      const searchForm = {name: 'second', request: {path: '', method: '', fmtParams: ''}, response: {body: ''}};
      const search$ = new BehaviorSubject(searchForm).asObservable();
      const refresh$ = new BehaviorSubject('start');
      mocksService.findFilteredMocks(search$, refresh$.asObservable()).subscribe(mocks => {
        expect(mocks).toBeTruthy();
        expect(mocks.length).toBe(refreshed ? 0 : 1);
      });
      tick(50);
      refreshed = true;
      refresh$.next('remove');
    })));

  it('should find mock array without filtering and update with new search', fakeAsync(inject([MocksService, MockBackend],
    (mocksService: MocksService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(c => c.mockRespond(new Response(new ResponseOptions({body: [firstMock, secondMock]}))));
      const searchForm = {name: '', request: {path: '', method: '', fmtParams: ''}, response: {body: ''}};
      const search$ = new BehaviorSubject(searchForm);
      const refresh$ = new BehaviorSubject('start').asObservable();
      let updated = false;
      mocksService.findFilteredMocks(search$.asObservable(), refresh$).subscribe(mocks => {
        expect(mocks).toBeTruthy();
        expect(mocks.length).toBe(updated ? 1 : 2);
      });
      tick(50);
      updated = true;
      search$.next({name: 'first', request: {path: '', method: '', fmtParams: ''}, response: {body: ''}})
    })));

  it('should find mock array', async(inject([MocksService, MockBackend], (mocksService: MocksService, mockBackend: MockBackend) => {
    mockBackend.connections.subscribe(c => c.mockRespond(new Response(new ResponseOptions({body: [firstMock, secondMock]}))));
    mocksService.findMocks().subscribe(mocks => {
      expect(mocks).toBeTruthy();
      expect(mocks.length).toBe(2);
    });
  })));

  it('should save mock', async(inject([MocksService, MockBackend], (mocksService: MocksService, mockBackend: MockBackend) => {
    mockBackend.connections.subscribe(c => c.mockRespond(new Response(new ResponseOptions({body: firstMock}))));
    mocksService.save(firstMock).subscribe(mock => {
      expect(mock).toBeTruthy();
      expect(mock.name).toBe('firstmock');
    });
  })));

  it('should remove mock', async(inject([MocksService, MockBackend], (mocksService: MocksService, mockBackend: MockBackend) => {
    mockBackend.connections.subscribe(c => c.mockRespond(new Response(new ResponseOptions({status: 204}))));
    mocksService.remove(firstMock).subscribe(nocontent => {
      expect(nocontent).toBeFalsy();
    });
  })));

  it('should redirect to mocks page', fakeAsync(inject([MocksService, Router, Location],
    (mocksService: MocksService, router: Router, location: Location) => {
      const fixture = createRoot(router, RootComponent);
      mocksService.redirectMocks();
      advance(fixture);
      expect(location.path()).toBe('/mocks');
    })));

  it('should call display 400 error message on save', fakeAsync(inject([MocksService, MdSnackBar],
    (mocksService: MocksService, mdSnackBar: MdSnackBar) => {
      spyOn(mdSnackBar, 'open');
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      mocksService.displaySaveError(new Response(new ResponseOptions({status: 400})));
      expect(mdSnackBar.open).toHaveBeenCalledWith('Invalid fields error', appConst.snackBar.closeBtnLabel);
    })));

  it('should call display 500 error message on save', fakeAsync(inject([MocksService, MdSnackBar],
    (mocksService: MocksService, mdSnackBar: MdSnackBar) => {
      spyOn(mdSnackBar, 'open');
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      mocksService.displaySaveError(new Response(new ResponseOptions({status: 500})));
      expect(mdSnackBar.open).toHaveBeenCalledWith('Server error', appConst.snackBar.closeBtnLabel);
    })));

  it('should call display 404 error message on find', fakeAsync(inject([MocksService, MdSnackBar],
    (mocksService: MocksService, mdSnackBar: MdSnackBar) => {
      spyOn(mdSnackBar, 'open');
      spyOn(mocksService, 'redirectMocks').and.returnValue(Observable.of(true));
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      mocksService.displayFindByNameError(new Response(new ResponseOptions({status: 404})), 'somemock');
      expect(mdSnackBar.open).toHaveBeenCalledWith('Mock with name somemock doesn\'t exist', appConst.snackBar.closeBtnLabel);
    })));

  it('should call display 500 error message on save', fakeAsync(inject([MocksService, MdSnackBar],
    (mocksService: MocksService, mdSnackBar: MdSnackBar) => {
      spyOn(mdSnackBar, 'open');
      spyOn(mocksService, 'redirectMocks').and.returnValue(Observable.of(true));
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      mocksService.displayFindByNameError(new Response(new ResponseOptions({status: 500})), 'somemock');
      expect(mdSnackBar.open).toHaveBeenCalledWith('Server error', appConst.snackBar.closeBtnLabel);
    })));

  it('should call display delete error', fakeAsync(inject([MocksService, MdSnackBar],
    (mocksService: MocksService, mdSnackBar: MdSnackBar) => {
      spyOn(mdSnackBar, 'open');
      spyOn(mocksService, 'redirectMocks').and.returnValue(Observable.of(true));
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      mocksService.displayRemoveError('somemock');
      expect(mdSnackBar.open).toHaveBeenCalledWith('Unable to remove mock with name somemock', appConst.snackBar.closeBtnLabel);
    })));

  it('should map key value array to literal', inject([MocksService], (mocksService: MocksService) => {
    const keyValArray = [{key: 'k0', value: 'v0'}, {key: 'k1', value: 'v1'}, {key: 'k2', value: 'v2'}];
    expect(mocksService.mapKeyValueToLiteral(keyValArray)).toEqual({k0: 'v0', k1: 'v1', k2: 'v2'});
  }));

  it('should map empty array to empty literal', inject([MocksService], (mocksService: MocksService) => {
    expect(mocksService.mapKeyValueToLiteral([])).toEqual({});
  }));

});
