import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData, docData, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Tag } from '../models/tags';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor(private firestore: Firestore) { }

  // Get all tags ordered by creation date descending
  getTags(): Observable<Tag[]> {
    const tagsRef = collection(this.firestore, 'tags');
    const tagsQuery = query(tagsRef, orderBy('createdAt', 'desc'));
    return collectionData(tagsQuery, { idField: 'id' }) as Observable<Tag[]>;
  }

  // Get a single tag by ID
  getTag(id: string): Observable<Tag> {
    const tagDocRef = doc(this.firestore, `tags/${id}`);
    return docData(tagDocRef, { idField: 'id' }) as Observable<Tag>;
  }

  // Add a new tag
  addTag(tag: Omit<Tag, 'id'>): Promise<any> {
    const tagsRef = collection(this.firestore, 'tags');
    const tagWithTimestamp = {
      ...tag,
      createdAt: new Date().toISOString()
    };
    return addDoc(tagsRef, tagWithTimestamp);
  }

  // Update an existing tag
  updateTag(tag: Tag): Promise<void> {
    const tagDocRef = doc(this.firestore, `tags/${tag.id}`);
    return updateDoc(tagDocRef, {
      name: tag.name
    });
  }

  // Delete a tag
  deleteTag(id: string): Promise<void> {
    const tagDocRef = doc(this.firestore, `tags/${id}`);
    return deleteDoc(tagDocRef);
  }
}
