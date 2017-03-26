import { NgModule } from '@angular/core';
import { MocksComponent } from './mocks.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [MocksComponent],
  imports: [SharedModule],
  exports: [MocksComponent]
})
export class MocksModule {
}
