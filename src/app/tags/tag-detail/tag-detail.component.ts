import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AlertController, IonicModule, LoadingController} from '@ionic/angular';
import { Observable } from 'rxjs';
import { Tag } from '../../common/models/tags';
import { TagsService } from '../../common/services/tags.service';
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-tag-detail',
  templateUrl: './tag-detail.component.html',
  // styleUrls: ['./tag-detail.component.scss'],
  imports: [
    IonicModule,
    RouterLink,
    AsyncPipe,
    NgIf
  ]
})
export class TagDetailComponent implements OnInit {
  tag$: Observable<Tag>;
  tagId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tagsService: TagsService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.tagId = this.route.snapshot.paramMap.get('id') as string;
    this.tag$ = this.tagsService.getTag(this.tagId);
  }

  async deleteTag() {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this tag?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: async () => {
            await this.tagsService.deleteTag(this.tagId);
            this.router.navigate(['/tags']);
          },
        },
      ],
    });

    await alert.present();
  }

  ngOnInit() {
    this.loadTag();
  }

  async loadTag() {
    const loading = await this.loadingController.create({
      message: 'Loading tag...',
    });
    await loading.present();

    this.tag$ = this.tagsService.getTag(this.tagId);

    this.tag$.subscribe(
      () => {
        loading.dismiss();
      },
      (error) => {
        console.error('Error loading tag', error);
        loading.dismiss();
      }
    );
  }
}
