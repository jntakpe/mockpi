import {fakeAsync, inject, TestBed} from '@angular/core/testing';
import {FakeMocksService} from '../mocks.service.spec';
import {MocksService} from '../mocks.service';
import {Router, Routes} from '@angular/router';
import {advance, createRoot, FakeFeatureComponent, FakeHomeComponent, RootComponent} from '../../shared/testing/testing-utils.spec';
import {MockEditResolver} from './mock-edit.resolver';
import {RouterTestingModule} from '@angular/router/testing';
import {Observable} from 'rxjs/Observable';
import {Location} from '@angular/common';
import {Response, ResponseOptions} from '@angular/http';

describe('MockEditResolver', () => {

  const routes: Routes = [
    {path: '', component: RootComponent},
    {path: 'home', component: FakeHomeComponent},
    {path: 'mocks/:name', component: FakeFeatureComponent, resolve: {mock: MockEditResolver}}
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [RootComponent, FakeHomeComponent, FakeFeatureComponent],
      providers: [
        MockEditResolver,
        {provide: MocksService, useClass: FakeMocksService}
      ]
    });
  });

  it('should create mock edit resolver', inject([MockEditResolver], (resolver: MockEditResolver) => {
    expect(resolver).toBeTruthy();
  }));

  it('should call resolve', fakeAsync(inject([MockEditResolver, Router], (resolver: MockEditResolver, router: Router) => {
    spyOn(resolver, 'resolve').and.returnValue(Observable.of(null));
    const fixture = createRoot(router, RootComponent);
    router.navigate(['mocks', 'testName']);
    advance(fixture);
    expect(resolver.resolve).toHaveBeenCalled();
  })));

  it('should redirect to MockEditComponent', fakeAsync(inject([Location, Router], (location: Location, router: Router) => {
    const fixture = createRoot(router, RootComponent);
    router.navigate(['mocks', 'testName']);
    advance(fixture);
    expect(location.path()).toBe('/mocks/testName');
  })));

  it('should call mocksService to retrieve mock', fakeAsync(inject([MockEditResolver, Router, MocksService],
    (resolver: MockEditResolver, router: Router, mocksService: MocksService) => {
      spyOn(mocksService, 'findByName').and.returnValue(Observable.of(null));
      const fixture = createRoot(router, RootComponent);
      router.navigate(['mocks', 'testName']);
      advance(fixture);
      expect(mocksService.findByName).toHaveBeenCalledWith('testName');
    })));

  it('should redirect without trying to retrieve mock', fakeAsync(inject([MockEditResolver, Router, MocksService],
    (resolver: MockEditResolver, router: Router, mocksService: MocksService) => {
      spyOn(mocksService, 'findByName').and.returnValue(Observable.of(null));
      const fixture = createRoot(router, RootComponent);
      router.navigate(['mocks', '']);
      advance(fixture);
      expect(mocksService.findByName).not.toHaveBeenCalled();
    })));

  it('should call display error cuz unable to retrieve mock', fakeAsync(inject([Router, MocksService],
    (router: Router, mocksService: MocksService) => {
      spyOn(mocksService, 'findByName').and.returnValue(Observable.throw(new Response(new ResponseOptions({status: 400}))));
      spyOn(mocksService, 'displayFindByErrorThenRedirect').and.returnValue(Observable.of(true));
      const fixture = createRoot(router, RootComponent);
      router.navigate(['mocks', 'error']);
      advance(fixture);
      expect(mocksService.displayFindByErrorThenRedirect).toHaveBeenCalled();
    })));

});
