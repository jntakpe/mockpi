import {async, TestBed} from '@angular/core/testing';

import {MockVisualizeComponent} from './mock-visualize.component';
import {MockpiMaterialModule} from '../../shared/mockpi-material.module';
import {MdDialog} from '@angular/material';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [MockpiMaterialModule, BrowserAnimationsModule, CommonModule],
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
    let dialogRef = dialog.open(MockVisualizeComponent, {data: {mock: 'test'}});
    component = dialogRef.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject data', () => {
    expect(component['data']).toBeTruthy();
  });

});
