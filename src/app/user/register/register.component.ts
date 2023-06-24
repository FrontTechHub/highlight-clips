import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import IUser from '../../models/user.model';
import { RegisterValidators } from '../validator/register-validators';
import { EmailTaken } from '../validator/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  inSubmission = false;

  name= new FormControl('', [
    Validators.required,
    Validators.minLength(5),
  ]);
  email= new FormControl('', [
    Validators.required,
    Validators.email,
  ], [this.emailTaken.validate]);
  age= new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(18),
    Validators.max(120),
  ]);
  password= new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
  ]);
  confirmPassword= new FormControl('',[
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
  ]);
  phoneNumber= new FormControl('', [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(10)
  ]);
  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirmPassword: this.confirmPassword,
    phoneNumber: this.phoneNumber,
  }, [RegisterValidators.match('password', 'confirmPassword')]);

  showAlert = false;
  alertMsg = 'Please wait ! Your account is being created';
  alertColor = 'blue';

  constructor(
    private authService: AuthService,
    private emailTaken: EmailTaken,
  ) {
  }
  async register() {
    this.inSubmission = true;
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being created...';
    this.alertColor = 'blue';

    try {
      await this.authService.createUser(this.registerForm.value as IUser);
    } catch (e) {
      this.alertMsg = 'An unexpected error occurred. Please try again later';
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }
    this.alertMsg = 'Success! Your account has been created';
    this.alertColor = 'green';
  }
}
