import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { ActivityComponent } from './activity.component';
import { MockpiMaterialModule } from '../shared/mockpi-material.module';
import { TableModule } from '../shared/table/table.module';
import { ActivityService } from './activity.service';
import { FakeActivityService, mockedResponses } from './activity.service.spec';
import { Observable } from 'rxjs/Observable';
import { By } from '@angular/platform-browser';

describe('ActivityComponent', () => {
  let component: ActivityComponent;
  let fixture: ComponentFixture<ActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityComponent],
      imports: [MockpiMaterialModule, TableModule],
      providers: [{provide: ActivityService, useClass: FakeActivityService}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display table', async(() => {
    expect(fixture.debugElement.query(By.css('ngx-datatable'))).toBeTruthy();
  }));

  it('should display 3 rows', async(() => {
    const rowsParent = fixture.debugElement.query(By.css('ngx-datatable datatable-scroller'));
    expect(rowsParent.children.length).toBe(3);
  }));

});
