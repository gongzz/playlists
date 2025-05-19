import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Tag } from '../models/tags';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor(private firestore: Firestore) { }

  // Get all tags
  getTags(): Observable<Tag[]> {
    const tagsRef = collection(this.firestore, 'tags');
    return collectionData(tagsRef, { idField: 'id' }) as Observable<Tag[]>;
  }

  // Get a single tag by ID
  getTag(id: string): Observable<Tag> {
    const tagDocRef = doc(this.firestore, `tags/${id}`);
    return docData(tagDocRef, { idField: 'id' }) as Observable<Tag>;
  }

  // Add a new tag
  addTag(tag: Omit<Tag, 'id'>): Promise<any> {
    const tagsRef = collection(this.firestore, 'tags');
    return addDoc(tagsRef, tag);
  }

  // Update an existing tag
  updateTag(tag: Tag): Promise<void> {
    const tagDocRef = doc(this.firestore, `tags/${tag.id}`);
    return updateDoc(tagDocRef, {
      name: tag.name,
      color: tag.color
    });
  }

  // Delete a tag
  deleteTag(id: string): Promise<void> {
    const tagDocRef = doc(this.firestore, `tags/${id}`);
    return deleteDoc(tagDocRef);
  }
}
