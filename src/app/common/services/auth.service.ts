import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userObservable$ = user(this.auth);
  user$ = new BehaviorSubject<any>(null);

  constructor(private auth: Auth) {
    this.userObservable$.subscribe(user => {
      this.user$.next(user);
    });
  }

  // Register a new user
  async register(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Login with email and password
  async login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Logout the current user
  async logout(): Promise<void> {
    return signOut(this.auth);
  }

  // Check if user is authenticated
  isAuthenticated(): Observable<any> {
    return this.user$;
  }
}
