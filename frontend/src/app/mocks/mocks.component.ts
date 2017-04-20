import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Mock } from '../shared/api.model';
import { MocksService } from './mocks.service';
import { Column } from '../shared/table/table-config.model';
import '../shared/rxjs.extension';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'mpi-mocks',
  templateUrl: './mocks.component.html',
  styleUrls: ['./mocks.component.scss']
})
export class MocksComponent implements OnInit {

  @ViewChild('actionsTpl') actionsTpl: TemplateRef<any>;

  columns: Column[];

  mocks$: Observable<Mock[]>;

  constructor(private mocksService: MocksService) {
  }

  ngOnInit() {
    this.columns = this.initColumns();
    this.mocks$ = this.mocksService.findMocks();
  }

  remove(mock: Mock): void {
    this.mocks$ = this.mocksService.remove(mock)
      .catch(() => this.mocksService.displayRemoveError(mock.name))
      .flatMap(() => this.mocksService.findMocks());
  }

  private initColumns(): Column[] {
    return [
      {prop: 'name', name: 'Name'},
      {prop: 'request.path', name: 'Path'},
      {prop: 'request.method', name: 'Method'},
      {prop: 'request.fmtParams', name: 'Params'},
      {prop: 'response.body', name: 'Body'},
      {cellTemplate: this.actionsTpl, name: 'Actions'}
    ];
  }

}
