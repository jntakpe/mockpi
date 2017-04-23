import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MockSearchComponent} from './mock-search.component';
import {MockpiMaterialModule} from '../../shared/mockpi-material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('MockSearchComponent', () => {
  let component: MockSearchComponent;
  let fixture: ComponentFixture<MockSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockSearchComponent],
      imports: [MockpiMaterialModule, ReactiveFormsModule, BrowserAnimationsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
