import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData, docData, query, orderBy, where, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tag } from '../models/tags';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  // Get all tags ordered by creation date descending for the current user
  getTags(): Observable<Tag[]> {
    const user = this.authService.user$.value;
    if (!user) {
      return new Observable<Tag[]>(subscriber => {
        subscriber.next([]);
        subscriber.complete();
      });
    }

    const tagsRef = collection(this.firestore, 'tags');
    const tagsQuery = query(
      tagsRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    return collectionData(tagsQuery, { idField: 'id' }) as Observable<Tag[]>;
  }

  // Get a single tag by ID
  getTag(id: string): Observable<Tag> {
    const tagDocRef = doc(this.firestore, `tags/${id}`);
    return docData(tagDocRef, { idField: 'id' }).pipe(
      map(tag => {
        const user = this.authService.user$.value;
        if (!user || (tag as Tag).userId !== user.uid) {
          throw new Error('Not authorized to access this tag');
        }
        return tag as Tag;
      })
    );
  }

  // Add a new tag with the current user's ID
  addTag(tag: Omit<Tag, 'id'>): Promise<any> {
    const user = this.authService.user$.value;
    if (!user) {
      return Promise.reject('User not authenticated');
    }

    const tagsRef = collection(this.firestore, 'tags');
    const tagWithUserAndTimestamp = {
      ...tag,
      userId: user.uid,
      createdAt: new Date().toISOString()
    };
    return addDoc(tagsRef, tagWithUserAndTimestamp);
  }

  // Update an existing tag (only if it belongs to the current user)
  async updateTag(tag: Tag): Promise<void> {
    const user = this.authService.user$.value;
    if (!user) {
      return Promise.reject('User not authenticated');
    }

    const tagDocRef = doc(this.firestore, `tags/${tag.id}`);

    try {
      // Get the tag data to check ownership
      const tagSnapshot = await getDoc(tagDocRef);
      const tagData = tagSnapshot.data() as Tag;

      // Check if the tag belongs to the current user
      if (!tagData || tagData.userId !== user.uid) {
        return Promise.reject('Not authorized to update this tag');
      }

      // If ownership is verified, proceed with update
      return updateDoc(tagDocRef, {
        name: tag.name,
        userId: user.uid // Ensure userId is preserved
      });
    } catch (error) {
      console.error('Error updating tag:', error);
      return Promise.reject('Error updating tag');
    }
  }

  // Delete a tag (only if it belongs to the current user)
  async deleteTag(id: string): Promise<void> {
    const user = this.authService.user$.value;
    if (!user) {
      return Promise.reject('User not authenticated');
    }

    // Get the tag first to check ownership
    const tagDocRef = doc(this.firestore, `tags/${id}`);

    try {
      // Get the tag data to check ownership
      const tagSnapshot = await getDoc(tagDocRef);
      const tagData = tagSnapshot.data() as Tag;

      // Check if the tag belongs to the current user
      if (!tagData || tagData.userId !== user.uid) {
        return Promise.reject('Not authorized to delete this tag');
      }

      // If ownership is verified, proceed with deletion
      return deleteDoc(tagDocRef);
    } catch (error) {
      console.error('Error deleting tag:', error);
      return Promise.reject('Error deleting tag');
    }
  }
}
