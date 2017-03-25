import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared.module';
import {HeaderComponent} from './header.component';
import {HeaderService} from './header.service';

@NgModule({
  declarations: [HeaderComponent],
  providers: [HeaderService],
  imports: [SharedModule],
  exports: [HeaderComponent]
})
export class HeaderModule {
}
