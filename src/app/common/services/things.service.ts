import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData, docData, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Thing } from '../models/things';

@Injectable({
  providedIn: 'root'
})
export class ThingsService {

  constructor(private firestore: Firestore) { }

  // Get all things ordered by creation date descending
  getThings(): Observable<Thing[]> {
    const thingsRef = collection(this.firestore, 'things');
    const thingsQuery = query(thingsRef, orderBy('createdAt', 'desc'));
    return collectionData(thingsQuery, { idField: 'id' }) as Observable<Thing[]>;
  }

  // Get a single thing by ID
  getThing(id: string): Observable<Thing> {
    const thingDocRef = doc(this.firestore, `things/${id}`);
    return docData(thingDocRef, { idField: 'id' }) as Observable<Thing>;
  }

  // Add a new thing
  addThing(thing: Omit<Thing, 'id'>): Promise<any> {
    const thingsRef = collection(this.firestore, 'things');
    const thingWithTimestamp = {
      ...thing,
      createdAt: new Date().toISOString()
    };
    return addDoc(thingsRef, thingWithTimestamp);
  }

  // Update an existing thing
  updateThing(thing: Thing): Promise<void> {
    const thingDocRef = doc(this.firestore, `things/${thing.id}`);
    const updateData: any = {
      name: thing.name,
      description: thing.description,
      container: thing.container
    };

    // Add room if it exists
    if (thing.room !== undefined) {
      updateData.room = thing.room;
    }

    // Add tags if they exist
    if (thing.tags !== undefined) {
      updateData.tags = thing.tags;
    }

    return updateDoc(thingDocRef, updateData);
  }

  // Delete a thing
  deleteThing(id: string): Promise<void> {
    const thingDocRef = doc(this.firestore, `things/${id}`);
    return deleteDoc(thingDocRef);
  }
}
