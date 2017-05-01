import {async, TestBed} from '@angular/core/testing';

import {MockVisualizeComponent} from './mock-visualize.component';
import {MockpiMaterialModule} from '../../shared/mockpi-material.module';
import {MdDialog} from '@angular/material';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  imports: [MockpiMaterialModule, BrowserAnimationsModule],
  declarations: [MockVisualizeComponent],
  exports: [MockVisualizeComponent],
  entryComponents: [MockVisualizeComponent]
})
export class MockVisualizeComponentModuleSpec {
}

describe('MockVisualizeComponent', () => {
  let component: MockVisualizeComponent;
  let dialog: MdDialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MockVisualizeComponentModuleSpec],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    dialog = TestBed.get(MdDialog);
    let dialogRef = dialog.open(MockVisualizeComponent);
    component = dialogRef.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
