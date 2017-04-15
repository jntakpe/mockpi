import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import {RegisterComponent} from './register.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {changeInputValueAndDispatch} from '../shared/testing/testing-utils.spec';
import {RegisterService} from './register.service';
import {Observable} from 'rxjs/Observable';
import {user} from './register.service.spec';
import {MockpiMaterialModule} from '../shared/mockpi-material.module';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let compiled: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [MockpiMaterialModule, BrowserAnimationsModule, ReactiveFormsModule],
      providers: [{
        provide: RegisterService,
        useValue: {
          register: () => Observable.of(user)
        }
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty form', async(() => {
    expect(compiled.querySelector('input[formcontrolname="username"]').value).toBe('');
    expect(compiled.querySelector('input[formcontrolname="name"]').value).toBe('');
    expect(compiled.querySelector('input[formcontrolname="email"]').value).toBe('');
    expect(compiled.querySelector('input[formcontrolname="password"]').value).toBe('');
    expect(compiled.querySelector('input[formcontrolname="confirmPassword"]').value).toBe('');
  }));

  it('should disable form submit if empty fields', async(() => {
    expect(compiled.querySelector('button[type="submit"]:disabled')).toBeTruthy();
  }));

  it('should enable form submit if form is valid', async(() => {
    const usernameInput = fixture.debugElement.query(By.css('input[formcontrolname="username"]'));
    const nameInput = fixture.debugElement.query(By.css('input[formcontrolname="name"]'));
    const mailInput = fixture.debugElement.query(By.css('input[formcontrolname="email"]'));
    const passwordInput = fixture.debugElement.query(By.css('input[formcontrolname="password"]'));
    const confirmPasswordInput = fixture.debugElement.query(By.css('input[formcontrolname="confirmPassword"]'));
    changeInputValueAndDispatch(usernameInput, 'jntakpe');
    changeInputValueAndDispatch(nameInput, 'Jocelyn');
    changeInputValueAndDispatch(mailInput, 'jntakpe@mail.com');
    changeInputValueAndDispatch(passwordInput, 'testPwd');
    changeInputValueAndDispatch(confirmPasswordInput, 'testPwd');
    fixture.detectChanges();
    expect(compiled.querySelector('button[type="submit"]:not(:disabled)')).toBeTruthy();
  }));

  it('should display error if username not set', async(() => {
    component.registerForm.get('username').markAsTouched();
    fixture.detectChanges();
    const mdError = compiled.querySelector('md-error');
    expect(mdError).toBeTruthy();
    expect(mdError.textContent).toContain('required');
  }));

  it('should display error if username too short', async(() => {
    component.registerForm.get('username').markAsTouched();
    const usernameInput = fixture.debugElement.query(By.css('input[formcontrolname="username"]'));
    changeInputValueAndDispatch(usernameInput, 'j');
    fixture.detectChanges();
    const mdError = compiled.querySelector('md-error');
    expect(mdError).toBeTruthy();
    expect(mdError.textContent).toContain('3 characters');
  }));

  it('should display error if name not set', async(() => {
    component.registerForm.get('name').markAsTouched();
    fixture.detectChanges();
    const mdError = compiled.querySelector('md-error');
    expect(mdError).toBeTruthy();
    expect(mdError.textContent).toContain('required');
  }));

  it('should display error if email not set', async(() => {
    component.registerForm.get('email').markAsTouched();
    fixture.detectChanges();
    const mdError = compiled.querySelector('md-error');
    expect(mdError).toBeTruthy();
    expect(mdError.textContent).toContain('required');
  }));

  it('should display error if email invalid', async(() => {
    component.registerForm.get('email').markAsTouched();
    const emailInput = fixture.debugElement.query(By.css('input[formcontrolname="email"]'));
    changeInputValueAndDispatch(emailInput, 'invalid.mail.com');
    fixture.detectChanges();
    const mdError = compiled.querySelector('md-error');
    expect(mdError).toBeTruthy();
    expect(mdError.textContent).toContain('valid');
  }));

  it('should display error if password not set', async(() => {
    component.registerForm.get('pwdForm').get('password').markAsTouched();
    fixture.detectChanges();
    const mdError = compiled.querySelector('md-error');
    expect(mdError).toBeTruthy();
    expect(mdError.textContent).toContain('required');
  }));

  it('should display error if password not same', async(() => {
    component.registerForm.get('pwdForm').get('password').markAsTouched();
    const passwordInput = fixture.debugElement.query(By.css('input[formcontrolname="password"]'));
    changeInputValueAndDispatch(passwordInput, 'somePwd');
    const confirmInput = fixture.debugElement.query(By.css('input[formcontrolname="confirmPassword"]'));
    changeInputValueAndDispatch(confirmInput, 'otherPwd');
    fixture.detectChanges();
    const mdError = compiled.querySelector('md-hint');
    expect(mdError).toBeTruthy();
    expect(mdError.textContent).toContain('match');
  }));

  it('should register user', async(inject([RegisterService], (registerService: RegisterService) => {
    const usernameInput = fixture.debugElement.query(By.css('input[formcontrolname="username"]'));
    const nameInput = fixture.debugElement.query(By.css('input[formcontrolname="name"]'));
    const mailInput = fixture.debugElement.query(By.css('input[formcontrolname="email"]'));
    const passwordInput = fixture.debugElement.query(By.css('input[formcontrolname="password"]'));
    const confirmPasswordInput = fixture.debugElement.query(By.css('input[formcontrolname="confirmPassword"]'));
    changeInputValueAndDispatch(usernameInput, 'jntakpe');
    changeInputValueAndDispatch(nameInput, 'Jocelyn');
    changeInputValueAndDispatch(mailInput, 'jntakpe@mail.com');
    changeInputValueAndDispatch(passwordInput, 'testPwd');
    changeInputValueAndDispatch(confirmPasswordInput, 'testPwd');
    fixture.detectChanges();
    spyOn(registerService, 'register').and.returnValue(Observable.of({}));
    compiled.querySelector('button[type="submit"]').click();
    fixture.detectChanges();
    expect(registerService.register).toHaveBeenCalledWith({username: 'jntakpe', name: 'Jocelyn', email: 'jntakpe@mail.com'}, 'testPwd');
  })));

});
