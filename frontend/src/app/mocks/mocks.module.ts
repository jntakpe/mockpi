import { NgModule } from '@angular/core';
import { MocksComponent } from './mocks.component';
import { SharedModule } from '../shared/shared.module';
import { MocksService } from './mocks.service';
import { CovalentDataTableModule } from '@covalent/core';

@NgModule({
  declarations: [MocksComponent],
  imports: [SharedModule, CovalentDataTableModule.forRoot()],
  exports: [MocksComponent],
  providers: [MocksService]
})
export class MocksModule {
}
