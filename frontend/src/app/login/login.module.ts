import {NgModule} from '@angular/core';
import {LoginComponent} from './login.component';
import {SharedModule} from '../shared/shared.module';
import {LoginService} from './login.service';

@NgModule({
  declarations: [LoginComponent],
  imports: [SharedModule],
  providers: [LoginService]
})
export class LoginModule {
}
