import { Component, OnInit } from '@angular/core';
import {AlertController, IonicModule} from '@ionic/angular';
import { Observable } from 'rxjs';
import { Container } from '../../common/models/containers';
import { ContainersService } from '../../common/services/containers.service';
import {AsyncPipe, NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-containers-list',
  templateUrl: './containers-list.component.html',
  // styleUrls: ['./containers-list.component.scss'],
  imports: [
    IonicModule,
    NgForOf,
    RouterLink,
    AsyncPipe
  ]
})
export class ContainersListComponent implements OnInit {
  containers$: Observable<Container[]>;

  constructor(
    private containersService: ContainersService,
    private alertController: AlertController
  ) {
    this.containers$ = this.containersService.getContainers();
  }

  ngOnInit() {}

  async deleteContainer(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this container?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: async () => {
            try {
              await this.containersService.deleteContainer(id);
              // Refresh the containers list
              this.containers$ = this.containersService.getContainers();
            } catch (error) {
              console.error('Error deleting container:', error);
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
