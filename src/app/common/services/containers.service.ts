import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Container } from '../models/containers';

@Injectable({
  providedIn: 'root'
})
export class ContainersService {

  constructor(private firestore: Firestore) { }

  // Get all containers
  getContainers(): Observable<Container[]> {
    const containersRef = collection(this.firestore, 'containers');
    return collectionData(containersRef, { idField: 'id' }) as Observable<Container[]>;
  }

  // Get a single container by ID
  getContainer(id: string): Observable<Container> {
    const containerDocRef = doc(this.firestore, `containers/${id}`);
    return docData(containerDocRef, { idField: 'id' }) as Observable<Container>;
  }

  // Add a new container
  addContainer(container: Omit<Container, 'id'>): Promise<any> {
    const containersRef = collection(this.firestore, 'containers');
    return addDoc(containersRef, container);
  }

  // Update an existing container
  updateContainer(container: Container): Promise<void> {
    const containerDocRef = doc(this.firestore, `containers/${container.id}`);
    return updateDoc(containerDocRef, {
      name: container.name,
      description: container.description
    });
  }

  // Delete a container
  deleteContainer(id: string): Promise<void> {
    const containerDocRef = doc(this.firestore, `containers/${id}`);
    return deleteDoc(containerDocRef);
  }
}
