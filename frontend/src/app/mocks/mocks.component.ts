import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Mock} from '../shared/api.model';
import {MocksService} from './mocks.service';
import '../shared/rxjs.extension';
import {Observable} from 'rxjs/Observable';
import {TableColumn} from '@swimlane/ngx-datatable/release';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {noop} from 'rxjs/util/noop';

@Component({
  selector: 'mpi-mocks',
  templateUrl: './mocks.component.html',
  styleUrls: ['./mocks.component.scss']
})
export class MocksComponent implements OnInit {

  @ViewChild('actionsTpl') actionsTpl: TemplateRef<any>;

  columns: TableColumn[];

  mocks$: Observable<Mock[]>;

  private refresh$ = new BehaviorSubject('start');

  private search$ = new BehaviorSubject({});

  constructor(private mocksService: MocksService) {
  }

  ngOnInit() {
    this.columns = this.initColumns();
    this.mocks$ = this.mocksService.findFilteredMocks(this.search$.asObservable(), this.refresh$.asObservable());
  }

  duplicate(mock: Mock): void {
    this.mocksService.duplicate(mock).subscribe();
  }

  remove(mock: Mock): void {
    this.mocksService.remove(mock)
      .catch(() => {
        this.mocksService.displayRemoveError(mock.name);
        return Observable.empty();
      }).subscribe(noop, noop, () => this.refresh$.next('remove'));
  }

  updateFilter(form: any): void {
    this.search$.next(form);
  }

  private initColumns(): TableColumn[] {
    return [
      {prop: 'name', name: 'Name'},
      {prop: 'request.path', name: 'Path'},
      {prop: 'request.method', name: 'Method'},
      {prop: 'request.fmtParams', name: 'Params'},
      {prop: 'response.body', name: 'Body', width: 600},
      {cellTemplate: this.actionsTpl, name: 'Actions', maxWidth: 100, sortable: false}
    ];
  }


}
