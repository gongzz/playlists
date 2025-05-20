import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {IonicModule, LoadingController, ToastController} from '@ionic/angular';
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
    private toastController: ToastController
  ) {
    this.containerId = this.route.snapshot.paramMap.get('id') as string;
    this.container$ = this.containersService.getContainer(this.containerId);
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
