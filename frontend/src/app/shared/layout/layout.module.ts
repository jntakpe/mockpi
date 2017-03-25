import {NgModule} from '@angular/core';
import {SharedModule} from '../shared.module';
import {LayoutComponent} from './layout.component';
import {RouterModule} from '@angular/router';
import {layoutRoutes} from './layout.routes';
import {HomeModule} from '../../home/home.module';
import {HeaderModule} from './header/header.module';

@NgModule({
  declarations: [LayoutComponent],
  imports: [SharedModule, HeaderModule, HomeModule, RouterModule.forChild(layoutRoutes)],
  exports: [LayoutComponent]
})
export class LayoutModule {

}
