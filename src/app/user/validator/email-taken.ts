import { AbstractControl, ValidationErrors } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { AsyncValidator } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class EmailTaken implements AsyncValidator {
  constructor(private auth: AngularFireAuth) {
  }

  validate = (control: AbstractControl): Promise<ValidationErrors | null> => {
    return new Promise<ValidationErrors | null>((resolve) => {
      this.auth.fetchSignInMethodsForEmail(control.value).then(
        response => response.length ? resolve({ emailTaken: true }) : resolve(null)
      )
    })
  }
}
