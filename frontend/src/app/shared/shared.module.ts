import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule, MaterialRootModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SecurityModule } from './security/security.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    HttpModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
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
    SecurityModule
  ]
})
export class SharedModule {
}
