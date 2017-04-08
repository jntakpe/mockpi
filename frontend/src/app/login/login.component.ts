import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';

@Component({
  selector: 'mpi-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('username') usernameInput: ElementRef;

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.focusLoginInput();
  }

  signIn() {
    const formValue = this.loginForm.value;
    this.loginService.login(formValue.username, formValue.password).subscribe(
      user => this.loginService.redirectHome(),
      error => this.handleLoginError(error));
  }

  private focusLoginInput() {
    this.usernameInput.nativeElement.focus();
  }

  private handleLoginError(error) {
    this.loginForm.reset();
    this.focusLoginInput();
    this.loginService.displayLoginErrorMsg(error);
  }

}
