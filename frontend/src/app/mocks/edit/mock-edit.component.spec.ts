import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MockEditComponent } from './mock-edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockpiMaterialModule } from '../../shared/mockpi-material.module';
import { ReactiveFormsModule } from '@angular/forms';

describe('MockEditComponent', () => {
  let component: MockEditComponent;
  let fixture: ComponentFixture<MockEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockEditComponent],
      imports: [MockpiMaterialModule, BrowserAnimationsModule, ReactiveFormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
