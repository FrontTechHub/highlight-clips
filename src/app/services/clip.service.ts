import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
  QuerySnapshot
} from '@angular/fire/compat/firestore'
import IClip from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {of, switchMap, map, BehaviorSubject, combineLatest} from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  public clipCollection: AngularFirestoreCollection<IClip>;

  constructor(
    public db: AngularFirestore,
    public auth: AngularFireAuth,
    public storage: AngularFireStorage,
  ) {
    this.clipCollection = this.db.collection('clips');
  }

  public createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return this.clipCollection.add(data);
  }

  public getUserClips(sort$: BehaviorSubject<string>) {
    return combineLatest([
      this.auth.user,
      sort$,
    ]).pipe(
      switchMap(values => {
        const [user, sort] = values;

        if (!user) {
          return of([]);
        }

        const query = this.clipCollection.ref.where(
          'uid', '==', user.uid
        ).orderBy(
          'timestamp',
          sort === '1' ? 'desc' : 'asc',
        );
        return query.get();
      }),
      map(snapshot => (snapshot as QuerySnapshot<IClip>).docs)
    )
  }

  public updateClip(id: string, title: string) {
    return this.clipCollection.doc(id).update({
      title,
    });
  }

  public async deleteClip(clip: IClip) {
    // Delete file
    const clipRef = this.storage.ref(`clips/${clip.fileName}`);
    await clipRef.delete();

    // Delete document
    await this.clipCollection.doc(clip.docId).delete();
  }
}
