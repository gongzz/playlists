import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Thing } from '../models/things';

@Injectable({
  providedIn: 'root'
})
export class ThingsService {

  constructor(private firestore: Firestore) { }

  // Get all things
  getThings(): Observable<Thing[]> {
    const thingsRef = collection(this.firestore, 'things');
    return collectionData(thingsRef, { idField: 'id' }) as Observable<Thing[]>;
  }

  // Get a single thing by ID
  getThing(id: string): Observable<Thing> {
    const thingDocRef = doc(this.firestore, `things/${id}`);
    return docData(thingDocRef, { idField: 'id' }) as Observable<Thing>;
  }

  // Add a new thing
  addThing(thing: Omit<Thing, 'id'>): Promise<any> {
    const thingsRef = collection(this.firestore, 'things');
    return addDoc(thingsRef, thing);
  }

  // Update an existing thing
  updateThing(thing: Thing): Promise<void> {
    const thingDocRef = doc(this.firestore, `things/${thing.id}`);
    return updateDoc(thingDocRef, {
      name: thing.name,
      description: thing.description,
      container: thing.container
    });
  }

  // Delete a thing
  deleteThing(id: string): Promise<void> {
    const thingDocRef = doc(this.firestore, `things/${id}`);
    return deleteDoc(thingDocRef);
  }
}
