import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ActivityDTO, Call } from '../shared/api.model';
import { MockedResponse } from './mocked-response';
import { environment } from '../../environments/environment';
import { List } from 'lodash';
import '../shared/rxjs.extension';
import * as moment from 'moment';

@Injectable()
export class ActivityService {

  constructor(private http: Http) {
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
      timestamp: moment(call.timestamp * 1000).format('DD/MM/YYYY HH:mm:ss:SSS'),
      duration: call.duration,
      name: activity.name,
      path: activity.path,
      method: activity.method,
      params: this.formatParams(activity.params)
    };

  }

  private formatParams(params: { [key: string]: string }): string {
    const urlSearchParams = new URLSearchParams();
    Object.keys(params).forEach(k => urlSearchParams.set(k, params[k]));
    return urlSearchParams.toString();
  }

}
