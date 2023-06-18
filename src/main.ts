import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

if(environment.production) {
  enableProdMode();
}
// connect to firebase app
firebase.initializeApp(environment.firebase);

let appInit = false;
// listen firebase event to init firebase before angular
firebase.auth().onAuthStateChanged(() => {
  if (!appInit) {
    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.error(err));
  }

  appInit = true;
});
