import { NgModule } from '@angular/core';
import { MocksComponent } from './mocks.component';
import { SharedModule } from '../shared/shared.module';
import { MocksService } from './mocks.service';
import { MockEditComponent } from './edit/mock-edit.component';
import { MockEditResolver } from './edit/mock-edit.resolver';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [MocksComponent, MockEditComponent],
  imports: [SharedModule, NgxDatatableModule],
  exports: [MocksComponent],
  providers: [MocksService, MockEditResolver]
})
export class MocksModule {
}
