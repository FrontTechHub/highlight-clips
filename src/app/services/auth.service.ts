import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';
import { delay, map, Observable, filter, switchMap, of } from 'rxjs';
import { Router } from '@angular/router';
import { ActivatedRoute, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  public redirect = false;
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
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

    // this logic to make sure the page just redirect to home page after logout if
    // the current page user is on needs to be authenticated
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.route.firstChild),
      switchMap(route => route?.data ?? of({ authOnly: false }))
    ).subscribe((data) => {
      this.redirect = data.authOnly ?? false;
    });
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

  // moved logout function from nav component to convenient and easy for reusing
  public async logout($event?: Event) {
    if ($event) {
      $event.preventDefault();
    }
    await this.auth.signOut();

    if (this.redirect) {
      await this.router.navigateByUrl('/');
    }
  }
}
