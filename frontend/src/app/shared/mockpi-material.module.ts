import { NgModule } from '@angular/core';
import {
  MdButtonModule,
  MdCardModule,
  MdIconModule,
  MdInputModule,
  MdMenuModule,
  MdSnackBarModule,
  MdToolbarModule
} from '@angular/material';

@NgModule({
  imports: [MdInputModule, MdSnackBarModule, MdButtonModule, MdMenuModule, MdIconModule, MdCardModule, MdToolbarModule],
  exports: [MdInputModule, MdSnackBarModule, MdButtonModule, MdMenuModule, MdIconModule, MdCardModule, MdToolbarModule]
})
export class MockpiMaterialModule {
}
