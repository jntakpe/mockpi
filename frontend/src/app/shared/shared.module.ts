import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule, MaterialRootModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SecurityModule} from './security/security.module';
import {CovalentCoreModule} from '@covalent/core';

@NgModule({
  imports: [
    CommonModule,
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
