import { Component, OnInit } from '@angular/core';
import { ActivityService } from './activity.service';
import { Observable } from 'rxjs/Observable';
import { MockedResponse } from './mocked-response';
import { TableColumn } from '@swimlane/ngx-datatable';

@Component({
  selector: 'mpi-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

  responses$: Observable<MockedResponse[]>;

  columns: TableColumn[];

  constructor(private activityService: ActivityService) {
  }

  ngOnInit() {
    this.columns = this.initColumns();
    this.responses$ = this.activityService.findActivities();
  }

  private initColumns(): TableColumn[] {
    return [
      {name: 'Timestamp'},
      {name: 'Duration (ms)', prop: 'duration'},
      {name: 'Name'},
      {name: 'Path'},
      {name: 'Method'},
      {name: 'Params'}
    ];
  }

}
