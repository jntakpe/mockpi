import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule, MaterialRootModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SecurityModule} from './security/security.module';
import {CovalentCoreModule} from '@covalent/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    HttpModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    CovalentCoreModule.forRoot(),
    SecurityModule
  ],
  exports: [
    CommonModule,
    BrowserAnimationsModule,
    HttpModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialRootModule,
    FlexLayoutModule,
    CovalentCoreModule,
    SecurityModule
  ]
})
export class SharedModule {
}
