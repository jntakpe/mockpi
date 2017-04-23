import {NgModule} from '@angular/core';
import {
  MdAutocompleteModule,
  MdButtonModule,
  MdCardModule,
  MdIconModule,
  MdInputModule,
  MdMenuModule,
  MdRadioModule,
  MdSelectModule,
  MdSnackBarModule,
  MdToolbarModule
} from '@angular/material';

@NgModule({
  imports: [
    MdInputModule,
    MdSelectModule,
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
    MdSelectModule,
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
