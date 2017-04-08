import { NgModule } from '@angular/core';
import { RegisterComponent } from './register.component';
import { SharedModule } from '../shared/shared.module';
import { RegisterService } from './register.service';

@NgModule({
  declarations: [RegisterComponent],
  imports: [SharedModule],
  exports: [RegisterComponent],
  providers: [RegisterService]
})
export class RegisterModule {
}
