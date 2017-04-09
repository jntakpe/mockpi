import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MockEditComponent } from './mock-edit.component';

describe('MockEditComponent', () => {
  let component: MockEditComponent;
  let fixture: ComponentFixture<MockEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockEditComponent]
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
