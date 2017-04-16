import {NgModule} from '@angular/core';
import {MocksComponent} from './mocks.component';
import {SharedModule} from '../shared/shared.module';
import {MocksService} from './mocks.service';
import {MockEditComponent} from './edit/mock-edit.component';
import {MockEditResolver} from './edit/mock-edit.resolver';

@NgModule({
  declarations: [MocksComponent, MockEditComponent],
  imports: [SharedModule],
  exports: [MocksComponent],
  providers: [MocksService, MockEditResolver]
})
export class MocksModule {
}
