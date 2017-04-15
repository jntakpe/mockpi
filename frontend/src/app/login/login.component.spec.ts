import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {LoginService} from './login.service';
import {By} from '@angular/platform-browser';
import {changeInputValueAndDispatch} from '../shared/testing/testing-utils.spec';
import {Response, ResponseOptions} from '@angular/http';
import {User} from '../shared/security/user';
import {Observable} from 'rxjs/Observable';
import '../shared/rxjs.extension';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MockpiMaterialModule} from '../shared/mockpi-material.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let compiled: any;

  class MockLoginService extends LoginService {

    constructor() {
      super(null, null, null);
    }

    login(username: string, password: string): Observable<User> {
      return Observable.of(new User('jntakpe', 'Joss', ['ADMIN']));
    }

    redirectHome(): Observable<boolean> {
      return Observable.of(true);
    }

    displayLoginErrorMsg({status}: Response): void {
    }

  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MockpiMaterialModule, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [{
        provide: LoginService,
        useClass: MockLoginService
      }],
      declarations: [LoginComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty form', async(() => {
    expect(compiled.querySelector('input[formcontrolname="username"]').value).toBe('');
    expect(compiled.querySelector('input[formcontrolname="password"]').value).toBe('');
  }));

  it('should disable form submit if empty fields', async(() => {
    expect(compiled.querySelector('button[type="submit"]:disabled')).toBeTruthy();
  }));

  it('should enable form submit if fields not empty', async(() => {
    const usernameInput = fixture.debugElement.query(By.css('input[formcontrolname="username"]'));
    const passwordInput = fixture.debugElement.query(By.css('input[formcontrolname="password"]'));
    const updatedValue = 'updatedValue';
    changeInputValueAndDispatch(usernameInput, updatedValue);
    changeInputValueAndDispatch(passwordInput, updatedValue);
    const form: FormGroup = fixture.debugElement.componentInstance.loginForm;
    fixture.detectChanges();
    expect(form.value.username).toBe(updatedValue);
    expect(form.value.password).toBe(updatedValue);
    expect(compiled.querySelector('button[type="submit"]:not(:disabled)')).toBeTruthy();
  }));

  it('should disable form submit if password empty after being set', async(() => {
    const usernameInput = fixture.debugElement.query(By.css('input[formcontrolname="username"]'));
    const passwordInput = fixture.debugElement.query(By.css('input[formcontrolname="password"]'));
    const updatedValue = 'updatedValue';
    changeInputValueAndDispatch(usernameInput, updatedValue);
    changeInputValueAndDispatch(passwordInput, updatedValue);
    const form: FormGroup = fixture.debugElement.componentInstance.loginForm;
    fixture.detectChanges();
    expect(form.value.username).toBe(updatedValue);
    expect(form.value.password).toBe(updatedValue);
    expect(compiled.querySelector('button[type="submit"]:not(:disabled)')).toBeTruthy();
    changeInputValueAndDispatch(passwordInput, '');
    fixture.detectChanges();
    expect(form.value.password).toBe('');
    expect(compiled.querySelector('button[type="submit"]:not(:disabled)')).toBeFalsy();
    expect(compiled.querySelector('button[type="submit"]:disabled')).toBeTruthy();
  }));

  it('should log in user and call redirect home', async(inject([LoginService], (loginService: LoginService) => {
    spyOn(loginService, 'redirectHome');
    const usernameInput = fixture.debugElement.query(By.css('input[formcontrolname="username"]'));
    const passwordInput = fixture.debugElement.query(By.css('input[formcontrolname="password"]'));
    changeInputValueAndDispatch(usernameInput, 'jntakpe');
    changeInputValueAndDispatch(passwordInput, 'test');
    fixture.detectChanges();
    compiled.querySelector('button[type="submit"]').click();
    fixture.detectChanges();
    expect(loginService.redirectHome).toHaveBeenCalled();
  })));

  it('should fail log in user and display message', async(inject([LoginService], (loginService: LoginService) => {
    spyOn(loginService, 'redirectHome');
    spyOn(loginService, 'displayLoginErrorMsg');
    spyOn(loginService, 'login').and.returnValue(Observable.throw(new Response(new ResponseOptions({status: 400}))));
    const usernameInput = fixture.debugElement.query(By.css('input[formcontrolname="username"]'));
    const passwordInput = fixture.debugElement.query(By.css('input[formcontrolname="password"]'));
    changeInputValueAndDispatch(usernameInput, 'toto');
    changeInputValueAndDispatch(passwordInput, 'titi');
    fixture.detectChanges();
    compiled.querySelector('button[type="submit"]').click();
    fixture.detectChanges();
    expect(loginService.displayLoginErrorMsg).toHaveBeenCalled();
    expect(loginService.redirectHome).toHaveBeenCalledTimes(0);
  })));

});
