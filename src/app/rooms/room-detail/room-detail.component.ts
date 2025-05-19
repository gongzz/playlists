import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Room } from '../../common/models/rooms';
import { RoomsService } from '../../common/services/rooms.service';
import { AsyncPipe, NgIf } from "@angular/common";

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  imports: [
    IonicModule,
    RouterLink,
    AsyncPipe,
    NgIf
  ]
})
export class RoomDetailComponent implements OnInit {
  room$: Observable<Room>;
  roomId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomsService: RoomsService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.roomId = this.route.snapshot.paramMap.get('id') as string;
    this.room$ = this.roomsService.getRoom(this.roomId);
  }

  async deleteRoom() {
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
            await this.roomsService.deleteRoom(this.roomId);
            this.router.navigate(['/rooms']);
          },
        },
      ],
    });

    await alert.present();
  }

  ngOnInit() {
    this.loadRoom();
  }

  async loadRoom() {
    const loading = await this.loadingController.create({
      message: 'Loading room...',
    });
    await loading.present();

    this.room$ = this.roomsService.getRoom(this.roomId);

    this.room$.subscribe(
      () => {
        loading.dismiss();
      },
      (error) => {
        console.error('Error loading room', error);
        loading.dismiss();
      }
    );
  }
}
