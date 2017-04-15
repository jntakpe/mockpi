import { async, inject, TestBed } from '@angular/core/testing';
import { MocksService } from './mocks.service';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { Mock } from '../shared/api.model';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
import { MdSnackBarModule } from '@angular/material';

const firstMock: Mock = {
  name: 'firstmock',
  request: {
    path: '/api/firstmock',
    method: 'GET',
    params: {},
    headers: {}
  },
  response: {
    body: 'strBody',
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
    body: 'strBody',
    status: 200,
    contentType: 'application/json'
  },
  collection: 'default',
  delay: 10,
  description: 'My second mock'
};

export class FakeMocksService extends MocksService {

  constructor() {
    super(null, null, null);
  }

  findMocks(): Observable<Mock[]> {
    return Observable.of([firstMock, secondMock]);
  }
}


describe('MocksService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, RouterTestingModule, MdSnackBarModule],
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


});
