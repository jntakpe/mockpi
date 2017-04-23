import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MockSearchComponent} from './mock-search.component';
import {MockpiMaterialModule} from '../../shared/mockpi-material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {changeInputValueAndDispatch} from '../../shared/testing/testing-utils.spec';

describe('MockSearchComponent', () => {
  let component: MockSearchComponent;
  let fixture: ComponentFixture<MockSearchComponent>;
  let compiled: any;

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
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty form', async(() => {
    expect(compiled.querySelector('input[formcontrolname="name"]').value).toBe('');
    expect(compiled.querySelector('*[formgroupname="request"] input[formcontrolname="path"]').value).toBe('');
    expect(compiled.querySelector('*[formgroupname="request"] md-select[formcontrolname="method"]')).toBeTruthy();
    expect(compiled.querySelector('*[formgroupname="request"] md-select[formcontrolname="method"] span.mat-select-value-text')).toBeFalsy();
    expect(compiled.querySelector('*[formgroupname="request"] input[formcontrolname="fmtParams"]').value).toBe('');
    expect(compiled.querySelector('*[formgroupname="response"] input[formcontrolname="body"]').value).toBe('');
  }));

  it('should emit event on change', async(() => {
    spyOn(component.searchChanges, 'emit');
    const nameInput = fixture.debugElement.query(By.css('input[formcontrolname="name"]'));
    const pathInput = fixture.debugElement.query(By.css('input[formcontrolname="path"]'));
    changeInputValueAndDispatch(nameInput, 'j');
    fixture.detectChanges();
    const emit = component.searchChanges.emit;
    expect(emit).toHaveBeenCalledWith({name: 'j', request: {path: '', method: '', fmtParams: ''}, response: {body: ''}});
    expect(emit).toHaveBeenCalledTimes(1);
    changeInputValueAndDispatch(pathInput, 'f');
    fixture.detectChanges();
    expect(emit).toHaveBeenCalledWith({name: 'j', request: {path: 'f', method: '', fmtParams: ''}, response: {body: ''}});
    expect(emit).toHaveBeenCalledTimes(2);
    changeInputValueAndDispatch(pathInput, 'fi');
    fixture.detectChanges();
    expect(emit).toHaveBeenCalledWith({name: 'j', request: {path: 'fi', method: '', fmtParams: ''}, response: {body: ''}});
    expect(emit).toHaveBeenCalledTimes(3);
  }));

  it('should call reset', async(() => {
    spyOn(component, 'reset');
    compiled.querySelector('button#reset-btn').click();
    fixture.detectChanges();
    expect(component.reset).toHaveBeenCalled();
  }));

  it('should reset search form', async(() => {
    const nameInput = fixture.debugElement.query(By.css('input[formcontrolname="name"]'));
    const pathInput = fixture.debugElement.query(By.css('input[formcontrolname="path"]'));
    changeInputValueAndDispatch(nameInput, 'search');
    changeInputValueAndDispatch(pathInput, 'mock');
    fixture.detectChanges();
    expect(compiled.querySelector('input[formcontrolname="name"]').value).toBe('search');
    expect(compiled.querySelector('*[formgroupname="request"] input[formcontrolname="path"]').value).toBe('mock');
    compiled.querySelector('button#reset-btn').click();
    fixture.detectChanges();
    expect(compiled.querySelector('input[formcontrolname="name"]').value).toBe('');
    expect(compiled.querySelector('*[formgroupname="request"] input[formcontrolname="path"]').value).toBe('');
  }));

});
