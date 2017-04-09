import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NavSignComponent } from './nav-sign/nav-sign.component';
import { NavSignService } from './nav-sign/nav-sign.service';
import { MockpiMaterialModule } from '../../mockpi-material.module';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent, NavSignComponent],
      imports: [RouterTestingModule, MockpiMaterialModule],
      providers: [{
        provide: NavSignService,
        useValue: jasmine.createSpyObj(NavSignService.name, ['username', 'logoutThenRedirectHome'])
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
