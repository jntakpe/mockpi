import {NgModule} from '@angular/core';
import {MocksComponent} from './mocks.component';
import {SharedModule} from '../shared/shared.module';
import {MocksService} from './mocks.service';
import {MockEditComponent} from './edit/mock-edit.component';
import {MockEditResolver} from './edit/mock-edit.resolver';
import {TableModule} from '../shared/table/table.module';
import {MockSearchComponent} from './search/mock-search.component';
import {MockVisualizeComponent} from './visualize/mock-visualize.component';

@NgModule({
  declarations: [MocksComponent, MockEditComponent, MockSearchComponent, MockVisualizeComponent],
  imports: [SharedModule, TableModule],
  exports: [MocksComponent],
  providers: [MocksService, MockEditResolver],
  entryComponents: [MockVisualizeComponent]
})
export class MocksModule {
}
