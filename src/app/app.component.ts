import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './common/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public appPages = [
    { title: 'Things', url: '/things', icon: 'cube' },
    { title: 'Containers', url: '/containers', icon: 'folder' },
    { title: 'Tags', url: '/tags', icon: 'pricetag' },
    { title: 'Rooms', url: '/rooms', icon: 'home' },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Logout error', error);
    }
  }
}
