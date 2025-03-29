import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public appPages = [
    { title: 'Musica', url: '/folder/music', icon: 'musical-notes' },
    { title: 'Artistas', url: '/folder/artists', icon: 'people' },
    { title: 'Albumes', url: '/folder/albums', icon: 'albums' },
    { title: 'Playlists', url: '/folder/playlists', icon: 'reorder-four' },
    { title: 'Generos', url: '/folder/genres', icon: 'shapes' },
  ];
  constructor() {}
}
