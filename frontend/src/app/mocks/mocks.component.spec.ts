import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MocksComponent } from './mocks.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { MocksService } from './mocks.service';
import { FakeMocksService } from './mocks.service.spec';

describe('MocksComponent', () => {
  let component: MocksComponent;
  let fixture: ComponentFixture<MocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MocksComponent],
      imports: [MaterialModule, BrowserAnimationsModule],
      providers: [{provide: MocksService, useClass: FakeMocksService}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
