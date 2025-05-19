import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {IonicModule, LoadingController, ToastController} from '@ionic/angular';
import { Tag } from '../../common/models/tags';
import { TagsService } from '../../common/services/tags.service';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-tag-form',
  templateUrl: './tag-form.component.html',
  // styleUrls: ['./tag-form.component.scss'],
  imports: [
    IonicModule,
    ReactiveFormsModule,
    NgIf
  ]
})
export class TagFormComponent implements OnInit {
  tagForm: FormGroup;
  tagId: string | null = null;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private tagsService: TagsService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.tagForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.tagId = this.route.snapshot.paramMap.get('id');
    this.isEdit = this.router.url.includes('edit');

    if (this.tagId && this.isEdit) {
      this.loadTag(this.tagId);
    }
  }

  async loadTag(id: string) {
    const loading = await this.loadingController.create({
      message: 'Loading tag...',
    });
    await loading.present();

    this.tagsService.getTag(id).subscribe(
      (tag) => {
        this.tagForm.patchValue({
          name: tag.name,
        });
        loading.dismiss();
      },
      (error) => {
        console.error('Error loading tag', error);
        loading.dismiss();
        this.presentToast('Error loading tag');
      }
    );
  }

  async saveTag() {
    if (this.tagForm.invalid) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Saving tag...',
    });
    await loading.present();

    const tagData = this.tagForm.value;

    try {
      if (this.isEdit && this.tagId) {
        await this.tagsService.updateTag({
          id: this.tagId,
          ...tagData,
        });
        this.presentToast('Tag updated successfully');
      } else {
        await this.tagsService.addTag(tagData);
        this.presentToast('Tag created successfully');
      }
      this.router.navigate(['/tags']);
    } catch (error) {
      console.error('Error saving tag', error);
      this.presentToast('Error saving tag');
    } finally {
      loading.dismiss();
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
    });
    toast.present();
  }
}
