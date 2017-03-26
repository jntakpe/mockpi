import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { LayoutComponent } from './layout.component';
import { RouterModule } from '@angular/router';
import { layoutRoutes } from './layout.routes';
import { HomeModule } from '../../home/home.module';
import { HeaderModule } from './header/header.module';
import { RegisterModule } from '../../register/register.module';

@NgModule({
  declarations: [LayoutComponent],
  imports: [SharedModule, HeaderModule, HomeModule, RegisterModule, RouterModule.forChild(layoutRoutes)],
  exports: [LayoutComponent]
})
export class LayoutModule {

}
