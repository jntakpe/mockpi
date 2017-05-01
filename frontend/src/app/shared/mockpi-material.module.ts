import {NgModule} from '@angular/core';
import {
  MdAutocompleteModule,
  MdButtonModule,
  MdCardModule,
  MdDialogModule,
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
    MdDialogModule,
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
    MdDialogModule,
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
