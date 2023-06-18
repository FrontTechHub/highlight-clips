import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';
import { delay, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
  ) {
    // this method will create a collection if it doesn't exist
    this.userCollection = db.collection('users');
    this.isAuthenticated$ = this.auth.user.pipe(
      map(user => !!user)
    );

    // Add delay 1s before destroying modal after user logged in
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    );
  }

  public async createUser(userData: IUser) {
    const { name, email, password, age, phoneNumber } = userData;
    if (!password) {
      throw new Error('Password not provided!')
    }
    const userCred = await this.auth.createUserWithEmailAndPassword(
      email,
      password,
    );

    if (!userCred.user) {
      throw new Error('User can not be found');
    }

    await this.userCollection.doc(userCred.user.uid).set({
      name,
      email,
      age,
      phoneNumber,
    });

    await userCred.user.updateProfile({
      displayName: name,
    });
  }
}
