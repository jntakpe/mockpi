import { async, inject, TestBed } from '@angular/core/testing';

import { ActivityService } from './activity.service';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockedResponse } from './mocked-response';
import { Observable } from 'rxjs/Observable';
import moment = require('moment');

const someDate = new Date();

export const mockedResponses: MockedResponse[] = [
  {
    timestamp: moment(someDate).format('DD/MM/YYYY HH:mm:ss:SSS'),
    duration: 1,
    name: 'firstMock',
    path: '/first/mock',
    method: 'GET',
    params: 'some=param'
  },
  {
    timestamp: moment(someDate).format('DD/MM/YYYY HH:mm:ss:SSS'),
    duration: 2,
    name: 'firstMock',
    path: '/first/mock',
    method: 'GET',
    params: 'some=param'
  },
  {
    timestamp: moment(someDate).format('DD/MM/YYYY HH:mm:ss:SSS'),
    duration: 3,
    name: 'secondMock',
    path: '/second/mock',
    method: 'GET',
    params: 'some=param'
  }];

export class FakeActivityService extends ActivityService {

  findActivities(): Observable<MockedResponse[]> {
    return Observable.of(mockedResponses);
  }

}

describe('ActivityService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        ActivityService,
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

  it('should create', inject([ActivityService], (service: ActivityService) => {
    expect(service).toBeTruthy();
  }));

  it('should find activities', async(inject([ActivityService, MockBackend],
    (activityService: ActivityService, mockBackend: MockBackend) => {
      const activityDTO = createActivities();
      mockBackend.connections.subscribe(c => c.mockRespond(new Response(new ResponseOptions({body: activityDTO}))));
      activityService.findActivities().subscribe(a => {
        expect(a).toBeTruthy();
        expect(a.length).toBe(3);
        expect(a).toEqual(mockedResponses);
      });
    })));

  function createActivities() {
    return [
      {
        name: 'firstMock',
        path: '/first/mock',
        method: 'GET',
        params: {
          some: 'param'
        },
        calls: [
          {
            duration: 1,
            timestamp: someDate.getTime() / 1000
          },
          {
            duration: 2,
            timestamp: someDate.getTime() / 1000
          }
        ]
      },
      {
        name: 'secondMock',
        path: '/second/mock',
        method: 'GET',
        params: {
          some: 'param'
        },
        calls: [{
          duration: 3,
          timestamp: someDate.getTime() / 1000
        }]
      }
    ];
  }

});
