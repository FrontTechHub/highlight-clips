import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore'
import ICip from '../models/clip.model';
@Injectable({
  providedIn: 'root'
})
export class ClipService {
  public clipCollection: AngularFirestoreCollection<ICip>;

  constructor(
    public db: AngularFirestore,
  ) {
    this.clipCollection = this.db.collection('clips');
  }

  createClip(data: ICip): Promise<DocumentReference<ICip>> {
    return this.clipCollection.add(data);
  }
}
