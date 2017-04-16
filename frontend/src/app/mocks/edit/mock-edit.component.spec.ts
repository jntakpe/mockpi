import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import {MockEditComponent} from './mock-edit.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MockpiMaterialModule} from '../../shared/mockpi-material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {MocksService} from '../mocks.service';
import {FakeMocksService} from '../mocks.service.spec';
import {By} from '@angular/platform-browser';
import {changeInputValueAndDispatch} from '../../shared/testing/testing-utils.spec';
import {Observable} from 'rxjs/Observable';
import {Response, ResponseOptions} from '@angular/http';
import {RouterTestingModule} from '@angular/router/testing';

describe('MockEditComponent', () => {
  let component: MockEditComponent;
  let fixture: ComponentFixture<MockEditComponent>;
  let compiled: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockEditComponent],
      imports: [MockpiMaterialModule, BrowserAnimationsModule, ReactiveFormsModule, RouterTestingModule],
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
    expect(compiled.querySelector('md-radio-group[formcontrolname="method"] md-radio-button[ng-reflect-value="GET"].mat-radio-checked'))
      .toBeTruthy();
    expect(compiled.querySelector('textarea[formcontrolname="body"]').value).toBe('');
    expect(compiled.querySelector('input[formcontrolname="status"]').value).toBe('');
    expect(compiled.querySelector('input[formcontrolname="contentType"]').value).toBe('');
  }));

  it('should disable form submit if empty fields', async(() => {
    expect(compiled.querySelector('button[type="submit"]:disabled')).toBeTruthy();
  }));

  it('should call save form', async(() => {
    initializeForm();
    spyOn(component, 'save').and.returnValue(Observable.of({}));
    compiled.querySelector('button[type="submit"]').click();
    fixture.detectChanges();
    expect(component.save).toHaveBeenCalled();
  }));

  it('should call save basic form', async(inject([MocksService], (mocksService: MocksService) => {
    const expected = initializeForm();
    expected.request.params = {};
    expected.request.headers = {};
    spyOn(mocksService, 'save').and.returnValue(Observable.of({}));
    compiled.querySelector('button[type="submit"]').click();
    fixture.detectChanges();
    expect(mocksService.save).toHaveBeenCalledWith(expected, undefined);
  })));

  it('should call save form on server', async(inject([MocksService], (mocksService: MocksService) => {
    initializeForm();
    spyOn(mocksService, 'save').and.returnValue(Observable.of({}));
    compiled.querySelector('button[type="submit"]').click();
    fixture.detectChanges();
    expect(mocksService.save).toHaveBeenCalled();
  })));

  it('should redirect to mocks after successfull save', async(inject([MocksService], (mocksService: MocksService) => {
    initializeForm();
    spyOn(mocksService, 'redirectMocks');
    compiled.querySelector('button[type="submit"]').click();
    fixture.detectChanges();
    expect(mocksService.redirectMocks).toHaveBeenCalled();
  })));

  it('should display error after saving failure', async(inject([MocksService], (mocksService: MocksService) => {
    initializeForm();
    spyOn(mocksService, 'save').and.returnValue(Observable.throw(new Response(new ResponseOptions({status: 400}))));
    spyOn(mocksService, 'displaySaveError');
    compiled.querySelector('button[type="submit"]').click();
    fixture.detectChanges();
    expect(mocksService.save).toHaveBeenCalled();
    expect(mocksService.displaySaveError).toHaveBeenCalled();
  })));

  it('should have params empty', async(() => {
    expect(compiled.querySelector('div[formarrayname="params"] input[formcontrolname="key"]')).toBeFalsy();
    expect(compiled.querySelector('div[formarrayname="params"] input[formcontrolname="value"]')).toBeFalsy();
  }));

  it('should have headers empty', async(() => {
    expect(compiled.querySelector('div[formarrayname="headers"] input[formcontrolname="key"]')).toBeFalsy();
    expect(compiled.querySelector('div[formarrayname="headers"] input[formcontrolname="value"]')).toBeFalsy();
  }));

  it('should add param', async(() => {
    compiled.querySelector('button#add-param').click();
    fixture.detectChanges();
    expect(compiled.querySelector('div[formarrayname="params"] input[formcontrolname="key"]')).toBeTruthy();
    expect(compiled.querySelector('div[formarrayname="params"] input[formcontrolname="value"]')).toBeTruthy();
  }));

  it('should add header', async(() => {
    compiled.querySelector('button#add-header').click();
    fixture.detectChanges();
    expect(compiled.querySelector('div[formarrayname="headers"] input[formcontrolname="key"]')).toBeTruthy();
    expect(compiled.querySelector('div[formarrayname="headers"] input[formcontrolname="value"]')).toBeTruthy();
  }));

  it('should remove param', async(() => {
    compiled.querySelector('button#add-param').click();
    fixture.detectChanges();
    compiled.querySelector('button#add-param').click();
    fixture.detectChanges();
    expect(compiled.querySelector('div[formarrayname="params"]').children.length).toBe(2);
    compiled.querySelector('button#remove-param').click();
    fixture.detectChanges();
    expect(compiled.querySelector('div[formarrayname="params"]').children.length).toBe(1);
  }));

  it('should remove header', async(() => {
    compiled.querySelector('button#add-header').click();
    fixture.detectChanges();
    compiled.querySelector('button#add-header').click();
    fixture.detectChanges();
    expect(compiled.querySelector('div[formarrayname="headers"]').children.length).toBe(2);
    compiled.querySelector('button#remove-header').click();
    fixture.detectChanges();
    expect(compiled.querySelector('div[formarrayname="headers"]').children.length).toBe(1);
  }));

  it('should call save form with params', async(inject([MocksService], (mocksService: MocksService) => {
    const expected = initializeForm();
    expected.request.params = {k0: 'v0', k1: 'v1'};
    expected.request.headers = {};
    compiled.querySelector('button#add-param').click();
    fixture.detectChanges();
    compiled.querySelector('button#add-param').click();
    fixture.detectChanges();
    const inputKeys = fixture.debugElement.queryAll(By.css('div[formarrayname="params"] input[formcontrolname="key"]'));
    const inputVals = fixture.debugElement.queryAll(By.css('div[formarrayname="params"] input[formcontrolname="value"]'));
    expect(inputKeys.length).toBe(2);
    expect(inputVals.length).toBe(2);
    changeInputValueAndDispatch(inputKeys[0], 'k0');
    changeInputValueAndDispatch(inputKeys[1], 'k1');
    changeInputValueAndDispatch(inputVals[0], 'v0');
    changeInputValueAndDispatch(inputVals[1], 'v1');
    fixture.detectChanges();
    spyOn(mocksService, 'save').and.returnValue(Observable.of({}));
    compiled.querySelector('button[type="submit"]').click();
    fixture.detectChanges();
    expect(mocksService.save).toHaveBeenCalledWith(expected, undefined);
  })));


  it('should call save form with headers', async(inject([MocksService], (mocksService: MocksService) => {
    const expected = initializeForm();
    expected.request.headers = {k0: 'v0', k1: 'v1'};
    expected.request.params = {};
    compiled.querySelector('button#add-header').click();
    fixture.detectChanges();
    compiled.querySelector('button#add-header').click();
    fixture.detectChanges();
    const inputKeys = fixture.debugElement.queryAll(By.css('div[formarrayname="headers"] input[formcontrolname="key"]'));
    const inputVals = fixture.debugElement.queryAll(By.css('div[formarrayname="headers"] input[formcontrolname="value"]'));
    expect(inputKeys.length).toBe(2);
    expect(inputVals.length).toBe(2);
    changeInputValueAndDispatch(inputKeys[0], 'k0');
    changeInputValueAndDispatch(inputKeys[1], 'k1');
    changeInputValueAndDispatch(inputVals[0], 'v0');
    changeInputValueAndDispatch(inputVals[1], 'v1');
    fixture.detectChanges();
    spyOn(mocksService, 'save').and.returnValue(Observable.of({}));
    compiled.querySelector('button[type="submit"]').click();
    fixture.detectChanges();
    expect(mocksService.save).toHaveBeenCalledWith(expected, undefined);
  })));
  function initializeForm(): any {
    const expected = {
      name: 'testing mock',
      collection: 'testing collection',
      delay: 50,
      description: 'testing description',
      request: {
        path: '/testing/mock',
        method: 'GET',
        params: [],
        headers: []
      },
      response: {
        body: '{"testing": "mock"}',
        status: '',
        contentType: ''
      }
    };
    const nameInput = fixture.debugElement.query(By.css('input[formcontrolname="name"]'));
    const collectionInput = fixture.debugElement.query(By.css('input[formcontrolname="collection"]'));
    const delayInput = fixture.debugElement.query(By.css('input[formcontrolname="delay"]'));
    const descriptionInput = fixture.debugElement.query(By.css('textarea[formcontrolname="description"]'));
    const pathInput = fixture.debugElement.query(By.css('input[formcontrolname="path"]'));
    const methodInput = fixture.debugElement.query(By.css('md-radio-group[formcontrolname="method"]'));
    const bodyInput = fixture.debugElement.query(By.css('textarea[formcontrolname="body"]'));
    changeInputValueAndDispatch(nameInput, expected.name);
    changeInputValueAndDispatch(collectionInput, expected.collection);
    changeInputValueAndDispatch(delayInput, expected.delay.toString());
    changeInputValueAndDispatch(descriptionInput, expected.description);
    changeInputValueAndDispatch(pathInput, expected.request.path);
    changeInputValueAndDispatch(methodInput, expected.request.method);
    changeInputValueAndDispatch(bodyInput, expected.response.body);
    fixture.detectChanges();
    return expected;
  }

});
