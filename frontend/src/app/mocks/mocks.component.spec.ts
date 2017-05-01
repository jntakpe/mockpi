import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import {MocksComponent} from './mocks.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MocksService} from './mocks.service';
import {FakeMocksService, firstMock} from './mocks.service.spec';
import {MockpiMaterialModule} from '../shared/mockpi-material.module';
import {RouterTestingModule} from '@angular/router/testing';
import {Observable} from 'rxjs/Observable';
import {ReactiveFormsModule} from '@angular/forms';
import {TableModule} from '../shared/table/table.module';
import {MockSearchComponent} from './search/mock-search.component';
import {By} from '@angular/platform-browser';
import {changeInputValueAndDispatch} from '../shared/testing/testing-utils.spec';
import {MdDialog} from '@angular/material';

describe('MocksComponent', () => {
  let component: MocksComponent;
  let fixture: ComponentFixture<MocksComponent>;
  let compiled: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MocksComponent, MockSearchComponent],
      imports: [MockpiMaterialModule, RouterTestingModule, BrowserAnimationsModule, TableModule, ReactiveFormsModule],
      providers: [{provide: MocksService, useClass: FakeMocksService}, {provide: MdDialog, useValue: {open: () => null}}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call remove mock', async(inject([MocksService], (mocksService: MocksService) => {
    spyOn(mocksService, 'remove').and.returnValue(Observable.of(null));
    spyOn(mocksService, 'findFilteredMocks').and.returnValue(Observable.of([firstMock]));
    const refresh$ = component['refresh$'];
    component.remove(firstMock);
    fixture.detectChanges();
    expect(mocksService.remove).toHaveBeenCalled();
    refresh$.subscribe(v => expect(v).toEqual('remove'));
  })));

  it('should call display error when remove failed', async(inject([MocksService], (mocksService: MocksService) => {
    spyOn(mocksService, 'remove').and.returnValue(Observable.throw(new Error('Some error')));
    spyOn(mocksService, 'findFilteredMocks').and.returnValue(Observable.of([firstMock]));
    spyOn(mocksService, 'displayRemoveError');
    const refresh$ = component['refresh$'];
    component.remove(firstMock);
    fixture.detectChanges();
    expect(mocksService.remove).toHaveBeenCalled();
    expect(mocksService.displayRemoveError).toHaveBeenCalledWith(firstMock.name);
    refresh$.subscribe(v => expect(v).toEqual('remove'));
  })));

  it('should call visualize mock', inject([MdDialog], (mdDialog: MdDialog) => {
    spyOn(mdDialog, 'open');
    component.visualize(firstMock);
    expect(mdDialog.open).toHaveBeenCalled();
  }));

  it('should call duplicate mock', async(inject([MocksService], (mocksService: MocksService) => {
    spyOn(mocksService, 'duplicate').and.returnValue(Observable.of(true));
    component.duplicate(firstMock);
    expect(mocksService.duplicate).toHaveBeenCalledWith(firstMock);
  })));

  it('should call update filter', async(() => {
    spyOn(component, 'updateFilter');
    const nameInput = fixture.debugElement.query(By.css('input[formcontrolname="name"]'));
    const pathInput = fixture.debugElement.query(By.css('input[formcontrolname="path"]'));
    changeInputValueAndDispatch(nameInput, 'j');
    fixture.detectChanges();
    const updateFilter = component.updateFilter;
    expect(updateFilter).toHaveBeenCalledWith({name: 'j', request: {path: '', method: '', fmtParams: ''}, response: {body: ''}});
    expect(updateFilter).toHaveBeenCalledTimes(1);
    changeInputValueAndDispatch(pathInput, 'f');
    fixture.detectChanges();
    expect(updateFilter).toHaveBeenCalledWith({name: 'j', request: {path: 'f', method: '', fmtParams: ''}, response: {body: ''}});
    expect(updateFilter).toHaveBeenCalledTimes(2);
    changeInputValueAndDispatch(pathInput, 'fi');
    fixture.detectChanges();
    expect(updateFilter).toHaveBeenCalledWith({name: 'j', request: {path: 'fi', method: '', fmtParams: ''}, response: {body: ''}});
    expect(updateFilter).toHaveBeenCalledTimes(3);
  }));

});
