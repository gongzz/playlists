import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {IonicModule, LoadingController} from '@ionic/angular';
import { Observable } from 'rxjs';
import { Tag } from '../../common/models/tags';
import { TagsService } from '../../common/services/tags.service';
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-tag-detail',
  templateUrl: './tag-detail.component.html',
  styleUrls: ['./tag-detail.component.scss'],
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
    private tagsService: TagsService,
    private loadingController: LoadingController
  ) {
    this.tagId = this.route.snapshot.paramMap.get('id') as string;
    this.tag$ = this.tagsService.getTag(this.tagId);
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
