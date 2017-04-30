import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SecurityModule} from './security/security.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MockpiMaterialModule} from './mockpi-material.module';
import {AlertModule} from './alert/alert.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    HttpModule,
    RouterModule,
    ReactiveFormsModule,
    MockpiMaterialModule,
    FlexLayoutModule,
    SecurityModule,
    AlertModule
  ],
  exports: [
    CommonModule,
    BrowserAnimationsModule,
    HttpModule,
    RouterModule,
    ReactiveFormsModule,
    MockpiMaterialModule,
    FlexLayoutModule,
    SecurityModule,
    AlertModule
  ]
})
export class SharedModule {
}
