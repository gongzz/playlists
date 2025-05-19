import { Component, OnInit } from '@angular/core';
import {AlertController, IonicModule} from '@ionic/angular';
import { Observable } from 'rxjs';
import { Thing } from '../../common/models/things';
import { ThingsService } from '../../common/services/things.service';
import {RouterLink} from "@angular/router";
import {AsyncPipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-things-list',
  templateUrl: './things-list.component.html',
  styleUrls: ['./things-list.component.scss'],
  imports: [
    IonicModule,
    RouterLink,
    NgForOf,
    AsyncPipe
  ]
})
export class ThingsListComponent implements OnInit {
  things$: Observable<Thing[]>;

  constructor(
    private thingsService: ThingsService,
    private alertController: AlertController
  ) {
    this.things$ = this.thingsService.getThings();
  }

  ngOnInit() {}

  async deleteThing(id: string) {
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
          handler: () => {
            this.thingsService.deleteThing(id);
          },
        },
      ],
    });

    await alert.present();
  }
}
