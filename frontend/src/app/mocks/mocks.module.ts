import { NgModule } from '@angular/core';
import { MocksComponent } from './mocks.component';
import { SharedModule } from '../shared/shared.module';
import { MocksService } from './mocks.service';

@NgModule({
  declarations: [MocksComponent],
  imports: [SharedModule],
  exports: [MocksComponent],
  providers: [MocksService]
})
export class MocksModule {
}
