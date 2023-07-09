import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore'
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

  async createClip(data: ICip) {
    await this.clipCollection.add(data);
  }
}
