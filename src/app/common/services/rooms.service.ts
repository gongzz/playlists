import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData, docData, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Room } from '../models/rooms';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  constructor(private firestore: Firestore) { }

  // Get all rooms ordered by creation date descending
  getRooms(): Observable<Room[]> {
    const roomsRef = collection(this.firestore, 'rooms');
    const roomsQuery = query(roomsRef, orderBy('createdAt', 'desc'));
    return collectionData(roomsQuery, { idField: 'id' }) as Observable<Room[]>;
  }

  // Get a single room by ID
  getRoom(id: string): Observable<Room> {
    const roomDocRef = doc(this.firestore, `rooms/${id}`);
    return docData(roomDocRef, { idField: 'id' }) as Observable<Room>;
  }

  // Add a new room
  addRoom(room: Omit<Room, 'id'>): Promise<any> {
    const roomsRef = collection(this.firestore, 'rooms');
    const roomWithTimestamp = {
      ...room,
      createdAt: new Date().toISOString()
    };
    return addDoc(roomsRef, roomWithTimestamp);
  }

  // Update an existing room
  updateRoom(room: Room): Promise<void> {
    const roomDocRef = doc(this.firestore, `rooms/${room.id}`);
    return updateDoc(roomDocRef, {
      name: room.name,
      description: room.description
    });
  }

  // Delete a room
  deleteRoom(id: string): Promise<void> {
    const roomDocRef = doc(this.firestore, `rooms/${id}`);
    return deleteDoc(roomDocRef);
  }
}
