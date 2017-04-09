import { NgModule } from '@angular/core';
import {
  MdAutocompleteModule,
  MdButtonModule,
  MdCardModule,
  MdIconModule,
  MdInputModule,
  MdMenuModule,
  MdRadioModule,
  MdSnackBarModule,
  MdToolbarModule
} from '@angular/material';

@NgModule({
  imports: [
    MdInputModule,
    MdSnackBarModule,
    MdButtonModule,
    MdMenuModule,
    MdIconModule,
    MdCardModule,
    MdToolbarModule,
    MdAutocompleteModule,
    MdRadioModule
  ],
  exports: [
    MdInputModule,
    MdSnackBarModule,
    MdButtonModule,
    MdMenuModule,
    MdIconModule,
    MdCardModule,
    MdToolbarModule,
    MdAutocompleteModule,
    MdRadioModule
  ]
})
export class MockpiMaterialModule {
}
