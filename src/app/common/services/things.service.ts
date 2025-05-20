import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData, docData, query, orderBy, where, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Thing } from '../models/things';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ThingsService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  // Get all things ordered by creation date descending for the current user
  getThings(): Observable<Thing[]> {
    const user = this.authService.user$.value;
    if (!user) {
      return new Observable<Thing[]>(subscriber => {
        subscriber.next([]);
        subscriber.complete();
      });
    }

    const thingsRef = collection(this.firestore, 'things');
    const thingsQuery = query(
      thingsRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    return collectionData(thingsQuery, { idField: 'id' }) as Observable<Thing[]>;
  }

  // Get a single thing by ID
  getThing(id: string): Observable<Thing> {
    const thingDocRef = doc(this.firestore, `things/${id}`);
    return docData(thingDocRef, { idField: 'id' }).pipe(
      map(thing => {
        const user = this.authService.user$.value;
        if (!user || (thing as Thing).userId !== user.uid) {
          throw new Error('Not authorized to access this thing');
        }
        return thing as Thing;
      })
    );
  }

  // Add a new thing with the current user's ID
  addThing(thing: Omit<Thing, 'id'>): Promise<any> {
    const user = this.authService.user$.value;
    if (!user) {
      return Promise.reject('User not authenticated');
    }

    const thingsRef = collection(this.firestore, 'things');
    const thingWithUserAndTimestamp = {
      ...thing,
      userId: user.uid,
      createdAt: new Date().toISOString()
    };
    return addDoc(thingsRef, thingWithUserAndTimestamp);
  }

  // Update an existing thing (only if it belongs to the current user)
  async updateThing(thing: Thing): Promise<void> {
    const user = this.authService.user$.value;
    if (!user) {
      return Promise.reject('User not authenticated');
    }

    const thingDocRef = doc(this.firestore, `things/${thing.id}`);

    try {
      // Get the thing data to check ownership
      const thingSnapshot = await getDoc(thingDocRef);
      const thingData = thingSnapshot.data() as Thing;

      // Check if the thing belongs to the current user
      if (!thingData || thingData.userId !== user.uid) {
        return Promise.reject('Not authorized to update this thing');
      }

      // If ownership is verified, proceed with update
      const updateData: any = {
        name: thing.name,
        description: thing.description,
        container: thing.container,
        userId: user.uid // Ensure userId is preserved
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
    } catch (error) {
      console.error('Error updating thing:', error);
      return Promise.reject('Error updating thing');
    }
  }

  // Delete a thing (only if it belongs to the current user)
  async deleteThing(id: string): Promise<void> {
    const user = this.authService.user$.value;
    if (!user) {
      return Promise.reject('User not authenticated');
    }

    // Get the thing first to check ownership
    const thingDocRef = doc(this.firestore, `things/${id}`);

    try {
      // Get the thing data to check ownership
      const thingSnapshot = await getDoc(thingDocRef);
      const thingData = thingSnapshot.data() as Thing;

      // Check if the thing belongs to the current user
      if (!thingData || thingData.userId !== user.uid) {
        return Promise.reject('Not authorized to delete this thing');
      }

      // If ownership is verified, proceed with deletion
      return deleteDoc(thingDocRef);
    } catch (error) {
      console.error('Error deleting thing:', error);
      return Promise.reject('Error deleting thing');
    }
  }
}
