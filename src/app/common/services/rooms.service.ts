import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData, docData, query, orderBy, where, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Room } from '../models/rooms';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  // Get all rooms ordered by creation date descending for the current user
  getRooms(): Observable<Room[]> {
    const user = this.authService.user$.value;
    if (!user) {
      return new Observable<Room[]>(subscriber => {
        subscriber.next([]);
        subscriber.complete();
      });
    }

    const roomsRef = collection(this.firestore, 'rooms');
    const roomsQuery = query(
      roomsRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    return collectionData(roomsQuery, { idField: 'id' }) as Observable<Room[]>;
  }

  // Get a single room by ID
  getRoom(id: string): Observable<Room> {
    const roomDocRef = doc(this.firestore, `rooms/${id}`);
    return docData(roomDocRef, { idField: 'id' }).pipe(
      map(room => {
        const user = this.authService.user$.value;
        if (!user || (room as Room).userId !== user.uid) {
          throw new Error('Not authorized to access this room');
        }
        return room as Room;
      })
    );
  }

  // Add a new room with the current user's ID
  addRoom(room: Omit<Room, 'id'>): Promise<any> {
    const user = this.authService.user$.value;
    if (!user) {
      return Promise.reject('User not authenticated');
    }

    const roomsRef = collection(this.firestore, 'rooms');
    const roomWithUserAndTimestamp = {
      ...room,
      userId: user.uid,
      createdAt: new Date().toISOString()
    };
    return addDoc(roomsRef, roomWithUserAndTimestamp);
  }

  // Update an existing room (only if it belongs to the current user)
  async updateRoom(room: Room): Promise<void> {
    const user = this.authService.user$.value;
    if (!user) {
      return Promise.reject('User not authenticated');
    }

    const roomDocRef = doc(this.firestore, `rooms/${room.id}`);

    try {
      // Get the room data to check ownership
      const roomSnapshot = await getDoc(roomDocRef);
      const roomData = roomSnapshot.data() as Room;

      // Check if the room belongs to the current user
      if (!roomData || roomData.userId !== user.uid) {
        return Promise.reject('Not authorized to update this room');
      }

      // If ownership is verified, proceed with update
      return updateDoc(roomDocRef, {
        name: room.name,
        description: room.description,
        userId: user.uid // Ensure userId is preserved
      });
    } catch (error) {
      console.error('Error updating room:', error);
      return Promise.reject('Error updating room');
    }
  }

  // Delete a room (only if it belongs to the current user)
  async deleteRoom(id: string): Promise<void> {
    const user = this.authService.user$.value;
    if (!user) {
      return Promise.reject('User not authenticated');
    }

    // Get the room first to check ownership
    const roomDocRef = doc(this.firestore, `rooms/${id}`);

    try {
      // Get the room data to check ownership
      const roomSnapshot = await getDoc(roomDocRef);
      const roomData = roomSnapshot.data() as Room;

      // Check if the room belongs to the current user
      if (!roomData || roomData.userId !== user.uid) {
        return Promise.reject('Not authorized to delete this room');
      }

      // If ownership is verified, proceed with deletion
      return deleteDoc(roomDocRef);
    } catch (error) {
      console.error('Error deleting room:', error);
      return Promise.reject('Error deleting room');
    }
  }
}
