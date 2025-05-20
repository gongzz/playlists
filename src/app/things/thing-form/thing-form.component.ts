import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {IonicModule, LoadingController, ToastController} from '@ionic/angular';
import { Observable } from 'rxjs';
import { Container } from '../../common/models/containers';
import { Room } from '../../common/models/rooms';
import { Tag } from '../../common/models/tags';
import { Thing } from '../../common/models/things';
import { ContainersService } from '../../common/services/containers.service';
import { RoomsService } from '../../common/services/rooms.service';
import { TagsService } from '../../common/services/tags.service';
import { ThingsService } from '../../common/services/things.service';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-thing-form',
  templateUrl: './thing-form.component.html',
  // styleUrls: ['./thing-form.component.scss'],
  imports: [
    IonicModule,
    ReactiveFormsModule,
    NgIf,
    AsyncPipe,
    NgForOf
  ]
})
export class ThingFormComponent implements OnInit {
  thingForm: FormGroup;
  thingId: string | null = null;
  isEdit = false;
  containers$: Observable<Container[]>;
  rooms$!: Observable<Room[]>;
  tags$!: Observable<Tag[]>;
  private userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private thingsService: ThingsService,
    private containersService: ContainersService,
    private roomsService: RoomsService,
    private tagsService: TagsService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.thingForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      container: [''],
      room: [''],
      tags: [[]]
    });

    this.containers$ = this.containersService.getContainers();
    this.rooms$ = this.roomsService.getRooms();
    this.tags$ = this.tagsService.getTags();
  }

  ngOnInit() {
    this.thingId = this.route.snapshot.paramMap.get('id');
    this.isEdit = this.router.url.includes('edit');

    if (this.thingId && this.isEdit) {
      this.loadThing(this.thingId);
    }
  }

  async loadThing(id: string) {
    const loading = await this.loadingController.create({
      message: 'Loading thing...',
    });
    await loading.present();

    this.thingsService.getThing(id).subscribe(
      (thing) => {
        this.thingForm.patchValue({
          name: thing.name,
          description: thing.description,
          container: thing.container,
          room: thing.room || '',
          tags: thing.tags || []
        });
        // Store the userId for later use when updating
        this.userId = thing.userId;
        loading.dismiss();
      },
      (error) => {
        console.error('Error loading thing', error);
        loading.dismiss();
        this.presentToast('Error loading thing');
      }
    );
  }

  async saveThing() {
    if (this.thingForm.invalid) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Saving thing...',
    });
    await loading.present();

    const thingData = this.thingForm.value;

    try {
      if (this.isEdit && this.thingId) {
        if (!this.userId) {
          throw new Error('User ID is missing');
        }
        await this.thingsService.updateThing({
          id: this.thingId,
          ...thingData,
          userId: this.userId
        });
        this.presentToast('Thing updated successfully');
      } else {
        await this.thingsService.addThing(thingData);
        this.presentToast('Thing created successfully');
      }
      this.router.navigate(['/things']);
    } catch (error) {
      console.error('Error saving thing', error);
      this.presentToast('Error saving thing');
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
