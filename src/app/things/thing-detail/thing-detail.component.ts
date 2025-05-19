import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {IonicModule, LoadingController} from '@ionic/angular';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Container } from '../../common/models/containers';
import { Thing } from '../../common/models/things';
import { ContainersService } from '../../common/services/containers.service';
import { ThingsService } from '../../common/services/things.service';
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-thing-detail',
  templateUrl: './thing-detail.component.html',
  styleUrls: ['./thing-detail.component.scss'],
  imports: [
    IonicModule,
    RouterLink,
    AsyncPipe,
    NgIf
  ]
})
export class ThingDetailComponent implements OnInit {
  thing$: Observable<Thing>;
  container$: Observable<Container> | null = null;
  thingId: string;

  constructor(
    private route: ActivatedRoute,
    private thingsService: ThingsService,
    private containersService: ContainersService,
    private loadingController: LoadingController
  ) {
    this.thingId = this.route.snapshot.paramMap.get('id') as string;
    this.thing$ = this.thingsService.getThing(this.thingId);
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
        if (thing.container) {
          this.container$ = this.containersService.getContainer(thing.container);
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
