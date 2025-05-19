import { Component, OnInit } from '@angular/core';
import {AlertController, IonicModule} from '@ionic/angular';
import { Observable } from 'rxjs';
import { Tag } from '../../common/models/tags';
import { TagsService } from '../../common/services/tags.service';
import {AsyncPipe, NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrls: ['./tags-list.component.scss'],
  imports: [
    IonicModule,
    NgForOf,
    AsyncPipe,
    RouterLink
  ]
})
export class TagsListComponent implements OnInit {
  tags$: Observable<Tag[]>;

  constructor(
    private tagsService: TagsService,
    private alertController: AlertController
  ) {
    this.tags$ = this.tagsService.getTags();
  }

  ngOnInit() {}

  async deleteTag(id: string) {
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
          handler: () => {
            this.tagsService.deleteTag(id);
          },
        },
      ],
    });

    await alert.present();
  }
}
