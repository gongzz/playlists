import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { Room } from '../../common/models/rooms';
import { RoomsService } from '../../common/services/rooms.service';
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  imports: [
    IonicModule,
    ReactiveFormsModule,
    NgIf
  ]
})
export class RoomFormComponent implements OnInit {
  roomForm: FormGroup;
  roomId: string | null = null;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private roomsService: RoomsService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.roomForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('id');
    this.isEdit = this.router.url.includes('edit');

    if (this.roomId && this.isEdit) {
      this.loadRoom(this.roomId);
    }
  }

  async loadRoom(id: string) {
    const loading = await this.loadingController.create({
      message: 'Loading room...',
    });
    await loading.present();

    this.roomsService.getRoom(id).subscribe(
      (room) => {
        this.roomForm.patchValue({
          name: room.name,
          description: room.description,
        });
        loading.dismiss();
      },
      (error) => {
        console.error('Error loading room', error);
        loading.dismiss();
        this.presentToast('Error loading room');
      }
    );
  }

  async saveRoom() {
    if (this.roomForm.invalid) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Saving room...',
    });
    await loading.present();

    const roomData = this.roomForm.value;

    try {
      if (this.isEdit && this.roomId) {
        await this.roomsService.updateRoom({
          id: this.roomId,
          ...roomData,
        });
        this.presentToast('Room updated successfully');
      } else {
        await this.roomsService.addRoom(roomData);
        this.presentToast('Room created successfully');
      }
      this.router.navigate(['/rooms']);
    } catch (error) {
      console.error('Error saving room', error);
      this.presentToast('Error saving room');
    } finally {
      loading.dismiss();
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
    });
    toast.present();
  }
}
