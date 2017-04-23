import {NgModule} from '@angular/core';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {FilterTableService} from './filter-table.service';

@NgModule({
  imports: [NgxDatatableModule],
  providers: [FilterTableService],
  exports: [NgxDatatableModule]
})
export class TableModule {
}
