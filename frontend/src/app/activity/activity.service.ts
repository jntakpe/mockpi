import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {FilterTableService} from '../shared/table/filter-table.service';
import {Observable} from 'rxjs/Observable';
import {ActivityDTO, Call} from '../shared/api.model';
import {MockedResponse} from './mocked-response';
import {environment} from '../../environments/environment';
import {List} from 'lodash';
import '../shared/rxjs.extension';

@Injectable()
export class ActivityService {

  constructor(private http: Http, private filterTableService: FilterTableService) {
  }

  findActivities(): Observable<MockedResponse[]> {
    return this.http.get(`${environment.baseUrl}/activities`)
      .map(res => res.json())
      .mergeMap((l: ActivityDTO[]) => Observable.from(l))
      .map(a => this.unwrapActivity(a))
      .mergeMap(m => Observable.from(m))
      .toArray();
  }

  private unwrapActivity(activity: ActivityDTO): List<MockedResponse> {
    return activity.calls.map(c => this.mapMockResponse(activity, c));
  }

  private mapMockResponse(activity: ActivityDTO, call: Call): MockedResponse {
    return {
      timestamp: call.timestamp,
      duration: call.duration,
      name: activity.name,
      path: activity.path,
      method: activity.method,
      params: ''
    };
  }

}
