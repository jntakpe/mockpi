import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { HeaderComponent } from './header.component';
import { NavSignComponent } from './nav-sign/nav-sign.component';
import { NavSignService } from './nav-sign/nav-sign.service';

@NgModule({
  declarations: [HeaderComponent, NavSignComponent],
  providers: [NavSignService],
  imports: [SharedModule],
  exports: [HeaderComponent]
})
export class HeaderModule {
}
