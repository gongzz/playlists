import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AlertController, IonicModule, LoadingController, ToastController} from '@ionic/angular';
import { Observable } from 'rxjs';
import { Container } from '../../common/models/containers';
import { ContainersService } from '../../common/services/containers.service';
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-container-detail',
  templateUrl: './container-detail.component.html',
  // styleUrls: ['./container-detail.component.scss'],
  imports: [
    IonicModule,
    RouterLink,
    AsyncPipe,
    NgIf
  ]
})
export class ContainerDetailComponent implements OnInit {
  container$: Observable<Container>;
  containerId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private containersService: ContainersService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    this.containerId = this.route.snapshot.paramMap.get('id') as string;
    this.container$ = this.containersService.getContainer(this.containerId);
  }

  async deleteContainer() {
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
              await this.containersService.deleteContainer(this.containerId);
              this.router.navigate(['/containers']);
            } catch (error) {
              console.error('Error deleting container:', error);
              this.presentErrorToast('Error deleting container');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  ngOnInit() {
    this.loadContainer();
  }

  async loadContainer() {
    const loading = await this.loadingController.create({
      message: 'Loading container...',
    });
    await loading.present();

    this.container$ = this.containersService.getContainer(this.containerId);

    this.container$.subscribe(
      () => {
        loading.dismiss();
      },
      (error) => {
        console.error('Error loading container', error);
        loading.dismiss();
        // Show error message and redirect to list view
        // this.presentErrorToast('Container not found or you do not have permission to view it');
        this.router.navigate(['/containers']);
      }
    );
  }

  async presentErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    toast.present();
  }
}
