import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {RegisterService} from './register.service';

@Component({
  selector: 'mpi-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private registerService: RegisterService) {
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, this.email]],
      name: ['', Validators.required],
      pwdForm: this.formBuilder.group({
        password: ['', [Validators.required]],
        confirmPassword: ''
      }, {
        validator: this.pwdMatch
      })
    });
  }

  email(formControl: FormControl): any {
    const emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    return emailRegex.test(formControl.value) ? null : {email: true};
  }

  pwdMatch(formGroup: FormGroup): any {
    const password = formGroup.get('password').value;
    const confirmPassword = formGroup.get('confirmPassword').value;
    return password === confirmPassword ? null : {pwdMatch: true};
  }

  register(): void {
    const {username, name, email, pwdForm: {password}} = this.registerForm.value;
    this.registerService.register({username, name, email}, password).subscribe();
  }


}
