import { Component, OnInit } from '@angular/core';
import { Mock } from '../shared/api.model';
import { MocksService } from './mocks.service';
import { ITdDataTableColumn, ITdDataTableSortChangeEvent } from '@covalent/core';
import { TableModel } from '../shared/table/table.model';

@Component({
  selector: 'mpi-mocks',
  templateUrl: './mocks.component.html',
  styleUrls: ['./mocks.component.scss']
})
export class MocksComponent implements OnInit {

  table: TableModel;

  mocks: Mock[];

  constructor(private mocksService: MocksService) {
    this.table = {
      columns: this.initColumns()
    };
  }

  ngOnInit() {
    this.mocksService.findMocks().subscribe(m => this.mocks = m);
  }

  initColumns(): ITdDataTableColumn[] {
    return [
      {name: 'name', label: 'Name', sortable: true},
      {name: 'request.path', label: 'Path', sortable: true},
      {name: 'request.method', label: 'Method', sortable: true},
      {name: 'request.fmtParams', label: 'Params', sortable: true},
      {name: 'response.status', label: 'Status', sortable: true}
    ];
  }

  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    this.table.sortBy = sortEvent.name;
    this.table.sortOrder = sortEvent.order;
    this.mocks = this.mocksService.updateTable(this.mocks, this.table);
  }

}
