import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { MocksComponent } from './mocks.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MocksService } from './mocks.service';
import { FakeMocksService, firstMock } from './mocks.service.spec';
import { MockpiMaterialModule } from '../shared/mockpi-material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

describe('MocksComponent', () => {
  let component: MocksComponent;
  let fixture: ComponentFixture<MocksComponent>;
  let compiled: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MocksComponent],
      imports: [MockpiMaterialModule, BrowserAnimationsModule, RouterTestingModule, BrowserAnimationsModule, NgxDatatableModule],
      providers: [{provide: MocksService, useClass: FakeMocksService}]
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
    spyOn(mocksService, 'findMocks').and.returnValue(Observable.of([firstMock]));
    component.remove(firstMock);
    fixture.detectChanges();
    expect(mocksService.remove).toHaveBeenCalled();
  })));

  it('should call display error when remove failed', async(inject([MocksService], (mocksService: MocksService) => {
    spyOn(mocksService, 'remove').and.returnValue(Observable.throw(new Error('Some error')));
    spyOn(mocksService, 'findMocks').and.returnValue(Observable.of([firstMock]));
    spyOn(mocksService, 'displayRemoveError').and.returnValue(Observable.empty());
    component.remove(firstMock);
    fixture.detectChanges();
    expect(mocksService.remove).toHaveBeenCalled();
    expect(mocksService.findMocks).not.toHaveBeenCalled();
    expect(mocksService.displayRemoveError).toHaveBeenCalledWith(firstMock.name);
  })));

});
