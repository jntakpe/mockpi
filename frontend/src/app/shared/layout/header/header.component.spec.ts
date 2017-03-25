import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import {HeaderComponent} from './header.component';
import {RouterTestingModule} from '@angular/router/testing';
import {MaterialModule} from '@angular/material';
import {HeaderService} from './header.service';
import {Observable} from 'rxjs';
import {By} from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule, MaterialModule],
      providers: [{
        provide: HeaderService,
        useValue: {username: () => Observable.of('jntakpe'), logoutThenRedirectHome: () => Observable.of(true)}
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

  it('should call logout', async(inject([HeaderService], (headerService: HeaderService) => {
    spyOn(headerService, 'logoutThenRedirectHome').and.returnValue(Observable.of(true));
    const logoutBtn = fixture.debugElement.query(By.css('a#logout-btn'));
    logoutBtn.nativeElement.click();
    fixture.detectChanges();
    expect(headerService.logoutThenRedirectHome).toHaveBeenCalled();
  })));
});
