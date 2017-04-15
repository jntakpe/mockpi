import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MockEditComponent} from './mock-edit.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MockpiMaterialModule} from '../../shared/mockpi-material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {MocksService} from '../mocks.service';
import {FakeMocksService} from '../mocks.service.spec';

describe('MockEditComponent', () => {
  let component: MockEditComponent;
  let fixture: ComponentFixture<MockEditComponent>;
  let compiled: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockEditComponent],
      imports: [MockpiMaterialModule, BrowserAnimationsModule, ReactiveFormsModule],
      providers: [{
        provide: MocksService,
        useClass: FakeMocksService
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty form', async(() => {
    expect(compiled.querySelector('input[formcontrolname="name"]').value).toBe('');
    expect(compiled.querySelector('input[formcontrolname="collection"]').value).toBe('');
    expect(compiled.querySelector('input[formcontrolname="delay"]').value).toBe('');
    expect(compiled.querySelector('textarea[formcontrolname="description"]').value).toBe('');
    expect(compiled.querySelector('input[formcontrolname="path"]').value).toBe('');
    console.log(compiled.querySelector('md-radio-group[formcontrolname="method"]'));
    expect(compiled.querySelector('md-radio-group[formcontrolname="method"] md-radio-button[ng-reflect-value="GET"].mat-radio-checked'))
      .toBeTruthy();
    // expect(compiled.querySelector('input[formcontrolname="params"]').value).toBe('');
    // expect(compiled.querySelector('input[formcontrolname="headers"]').value).toBe('');
    expect(compiled.querySelector('textarea[formcontrolname="body"]').value).toBe('');
    expect(compiled.querySelector('input[formcontrolname="status"]').value).toBe('');
    expect(compiled.querySelector('input[formcontrolname="contentType"]').value).toBe('');
  }));

  it('should disable form submit if empty fields', async(() => {
    expect(compiled.querySelector('button[type="submit"]:disabled')).toBeTruthy();
  }));

});
