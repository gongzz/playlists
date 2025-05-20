import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData, docData, query, orderBy, where, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Container } from '../models/containers';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ContainersService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  // Get all containers ordered by creation date descending for the current user
  getContainers(): Observable<Container[]> {
    const user = this.authService.user$.value;
    if (!user) {
      return new Observable<Container[]>(subscriber => {
        subscriber.next([]);
        subscriber.complete();
      });
    }

    const containersRef = collection(this.firestore, 'containers');
    const containersQuery = query(
      containersRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    return collectionData(containersQuery, { idField: 'id' }) as Observable<Container[]>;
  }

  // Get a single container by ID
  getContainer(id: string): Observable<Container> {
    const containerDocRef = doc(this.firestore, `containers/${id}`);
    return docData(containerDocRef, { idField: 'id' }).pipe(
      map(container => {
        const user = this.authService.user$.value;
        if (!user || (container as Container).userId !== user.uid) {
          throw new Error('Not authorized to access this container');
        }
        return container as Container;
      })
    );
  }

  // Add a new container with the current user's ID
  addContainer(container: Omit<Container, 'id'>): Promise<any> {
    const user = this.authService.user$.value;
    if (!user) {
      return Promise.reject('User not authenticated');
    }

    const containersRef = collection(this.firestore, 'containers');
    const containerWithUserAndTimestamp = {
      ...container,
      userId: user.uid,
      createdAt: new Date().toISOString()
    };
    return addDoc(containersRef, containerWithUserAndTimestamp);
  }

  // Update an existing container (only if it belongs to the current user)
  async updateContainer(container: Container): Promise<void> {
    const user = this.authService.user$.value;
    if (!user) {
      return Promise.reject('User not authenticated');
    }

    const containerDocRef = doc(this.firestore, `containers/${container.id}`);

    try {
      // Get the container data to check ownership
      const containerSnapshot = await getDoc(containerDocRef);
      const containerData = containerSnapshot.data() as Container;

      // Check if the container belongs to the current user
      if (!containerData || containerData.userId !== user.uid) {
        return Promise.reject('Not authorized to update this container');
      }

      // If ownership is verified, proceed with update
      return updateDoc(containerDocRef, {
        name: container.name,
        description: container.description,
        userId: user.uid // Ensure userId is preserved
      });
    } catch (error) {
      console.error('Error updating container:', error);
      return Promise.reject('Error updating container');
    }
  }

  // Delete a container (only if it belongs to the current user)
  async deleteContainer(id: string): Promise<void> {
    const user = this.authService.user$.value;
    if (!user) {
      return Promise.reject('User not authenticated');
    }

    // Get the container first to check ownership
    const containerDocRef = doc(this.firestore, `containers/${id}`);

    try {
      // Get the container data to check ownership
      const containerSnapshot = await getDoc(containerDocRef);
      const containerData = containerSnapshot.data() as Container;

      // Check if the container belongs to the current user
      if (!containerData || containerData.userId !== user.uid) {
        return Promise.reject('Not authorized to delete this container');
      }

      // If ownership is verified, proceed with deletion
      return deleteDoc(containerDocRef);
    } catch (error) {
      console.error('Error deleting container:', error);
      return Promise.reject('Error deleting container');
    }
  }
}
