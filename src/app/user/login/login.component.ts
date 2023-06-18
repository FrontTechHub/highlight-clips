import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: '',
  };

  inSubmission = false;
  showAlert = false;
  alertMsg = 'Please wait! We are logging you in...';
  alertColor = 'blue';
  constructor(
    private auth: AngularFireAuth,
  ) {}
  async login() {
    this.inSubmission = true;
    this.showAlert = true;
    this.alertMsg = 'Please wait! We are logging you in...';
    this.alertColor = 'blue';

    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password,
      );
    } catch (e) {
      this.alertMsg = 'An unexpected error occurred. Please try again later';
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }
    this.alertMsg = 'Success! You are now logged in';
    this.alertColor = 'green';
  }
}
