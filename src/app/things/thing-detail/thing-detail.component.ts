import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AlertController, IonicModule, LoadingController} from '@ionic/angular';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Container } from '../../common/models/containers';
import { Room } from '../../common/models/rooms';
import { Tag } from '../../common/models/tags';
import { Thing } from '../../common/models/things';
import { ContainersService } from '../../common/services/containers.service';
import { RoomsService } from '../../common/services/rooms.service';
import { TagsService } from '../../common/services/tags.service';
import { ThingsService } from '../../common/services/things.service';
import {AsyncPipe, NgFor, NgIf} from "@angular/common";

@Component({
  selector: 'app-thing-detail',
  templateUrl: './thing-detail.component.html',
  // styleUrls: ['./thing-detail.component.scss'],
  imports: [
    IonicModule,
    RouterLink,
    AsyncPipe,
    NgIf,
    NgFor
  ]
})
export class ThingDetailComponent implements OnInit {
  thing$: Observable<Thing>;
  container$: Observable<Container> | null = null;
  room$: Observable<Room> | null = null;
  tags$: Observable<Tag[]> | null = null;
  tagsList: Tag[] = [];
  thingId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private thingsService: ThingsService,
    private containersService: ContainersService,
    private roomsService: RoomsService,
    private tagsService: TagsService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.thingId = this.route.snapshot.paramMap.get('id') as string;
    this.thing$ = this.thingsService.getThing(this.thingId);
  }

  async deleteThing() {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: async () => {
            await this.thingsService.deleteThing(this.thingId);
            this.router.navigate(['/things']);
          },
        },
      ],
    });

    await alert.present();
  }

  ngOnInit() {
    this.loadThing();
  }

  async loadThing() {
    const loading = await this.loadingController.create({
      message: 'Loading thing...',
    });
    await loading.present();

    this.thing$ = this.thingsService.getThing(this.thingId);

    this.thing$.subscribe(
      (thing) => {
        // Load container if available
        if (thing.container) {
          this.container$ = this.containersService.getContainer(thing.container);
        }

        // Load room if available
        if (thing.room) {
          this.room$ = this.roomsService.getRoom(thing.room);
        }

        // Load tags if available
        if (thing.tags && thing.tags.length > 0) {
          // Load each tag individually and store in tagsList
          this.tagsList = [];
          thing.tags.forEach(tagId => {
            this.tagsService.getTag(tagId).subscribe(tag => {
              this.tagsList.push(tag);
            });
          });
        }

        loading.dismiss();
      },
      (error) => {
        console.error('Error loading thing', error);
        loading.dismiss();
      }
    );
  }
}
