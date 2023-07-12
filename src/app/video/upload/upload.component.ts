import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs';
import { ClipService } from '../../services/clip.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {
  showAlert = false;
  alertMsg = 'Please wait ! Your clip is being uploaded';
  alertColor = 'blue';
  inSubmission = false;
  percentage = 0;
  showPercentage = false;
  user: firebase.User | null= null;

  isDragover = false;
  file: File | null = null;
  nextStep = false;
  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3),
    ],
    nonNullable: true,
  });
  uploadForm = new FormGroup({
    title: this.title,
  });
  task?: AngularFireUploadTask;

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clip: ClipService,
    private router: Router,
  ) {
    this.auth.user.subscribe(
      user => this.user = user,
    );
  }

  ngOnDestroy() {
    // This function will trigger before the component destroyed
    // the cancel() function will cancel the request to upload file to Firebase
    // in-case when user redirect from upload component to another component
    this.task?.cancel();
  }

  storeFile($event: Event) {
    this.isDragover = false;
    this.file = ($event as DragEvent).dataTransfer ?
      ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
      ($event.target as HTMLInputElement).files?.item(0) ?? null;
    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.nextStep = true;
  }

  async uploadFile() {
    // disable function is available on all group
    // In-case during uploading is processing, we don't want user touch to any control group in form
    // this.uploadForm.disable();

    // but in this case inSubmission already covered it.
    this.inSubmission = true;
    this.showPercentage = true;
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your clip is being uploaded...';
    this.alertColor = 'blue';

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;
    this.task = this.storage.upload(clipPath, this.file);
    // Create reference to the file, the ref is an object point to a specific file,
    // this one can be created before uploading completed
    const clipRef = this.storage.ref(clipPath);

    this.task.percentageChanges().subscribe(
      progress => {
        this.percentage = progress as number / 100;
      },
    );
    this.task.snapshotChanges().pipe(
      last(),
      switchMap(() => clipRef.getDownloadURL())
    ).subscribe({
      next: async (url) => {
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url,
        };
        // Create data for clips Collection
        const clipDocRef = await this.clip.createClip(clip);

        // Update alert message
        this.alertColor = 'green';
        this.alertMsg = 'Success! Your clip is now ready to share with the world';
        this.showPercentage = false;

        // Wait a bit before redirecting user to clip detail page
        setTimeout(() => {
          // the uri looks like: localhost:4200/clip/123nskdsad
          this.router.navigate([
            'clip', clipDocRef.id
          ]);
        }, 1000)
      },
      error: () => {
        // this.uploadForm.enable();
        this.showPercentage = false;
        this.inSubmission = false;
        this.alertColor = 'red';
        this.alertMsg = 'An unexpected error occurred! Please try again later';
      }
    })
  }
}
