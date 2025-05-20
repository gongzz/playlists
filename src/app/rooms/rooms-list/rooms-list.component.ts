import { Component, OnInit } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Room } from '../../common/models/rooms';
import { RoomsService } from '../../common/services/rooms.service';
import { AsyncPipe, NgForOf } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.component.html',
  imports: [
    IonicModule,
    NgForOf,
    RouterLink,
    AsyncPipe
  ]
})
export class RoomsListComponent implements OnInit {
  rooms$: Observable<Room[]>;

  constructor(
    private roomsService: RoomsService,
    private alertController: AlertController
  ) {
    this.rooms$ = this.roomsService.getRooms();
  }

  ngOnInit() {}

  async deleteRoom(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this room?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: async () => {
            try {
              await this.roomsService.deleteRoom(id);
              // Refresh the rooms list
              this.rooms$ = this.roomsService.getRooms();
            } catch (error) {
              console.error('Error deleting room:', error);
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
