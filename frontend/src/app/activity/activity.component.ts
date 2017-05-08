import {Component, OnInit} from '@angular/core';
import {ActivityService} from './activity.service';
import {Observable} from 'rxjs/Observable';
import {MockedResponse} from './mocked-response';

@Component({
  selector: 'mpi-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

  responses$: Observable<MockedResponse[]>;

  constructor(private activityService: ActivityService) {
  }

  ngOnInit() {
    this.responses$ = this.activityService.findActivities();
  }

}
