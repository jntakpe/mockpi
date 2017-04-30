import {NgModule} from '@angular/core';
import {AlertService} from './alert.service';
import {MdSnackBarModule} from '@angular/material';

@NgModule({
  imports: [MdSnackBarModule],
  providers: [AlertService]
})
export class AlertModule {
}
