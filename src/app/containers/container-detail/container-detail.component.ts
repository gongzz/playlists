import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {IonicModule, LoadingController} from '@ionic/angular';
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
    private containersService: ContainersService,
    private loadingController: LoadingController
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
      }
    );
  }
}
