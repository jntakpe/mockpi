import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { NavSignComponent } from './nav-sign.component';
import { Observable } from 'rxjs/Observable';
import '../../../rxjs.extension';
import { NavSignService } from './nav-sign.service';
import { By } from '@angular/platform-browser';
import { MockpiMaterialModule } from '../../../mockpi-material.module';

describe('NavSignComponent', () => {
  let component: NavSignComponent;
  let fixture: ComponentFixture<NavSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavSignComponent],
      imports: [MockpiMaterialModule],
      providers: [{
        provide: NavSignService,
        useValue: {username: () => Observable.of('jntakpe'), logoutThenRedirectHome: () => Observable.of(true)}
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout', async(inject([NavSignService], (navSignService: NavSignService) => {
    spyOn(navSignService, 'logoutThenRedirectHome').and.returnValue(Observable.of(true));
    const logoutBtn = fixture.debugElement.query(By.css('a#logout-btn'));
    logoutBtn.nativeElement.click();
    fixture.detectChanges();
    expect(navSignService.logoutThenRedirectHome).toHaveBeenCalled();
  })));

});
