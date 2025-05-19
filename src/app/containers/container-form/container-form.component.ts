import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {IonicModule, LoadingController, ToastController} from '@ionic/angular';
import { Container } from '../../common/models/containers';
import { ContainersService } from '../../common/services/containers.service';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-container-form',
  templateUrl: './container-form.component.html',
  styleUrls: ['./container-form.component.scss'],
  imports: [
    IonicModule,
    ReactiveFormsModule,
    NgIf
  ]
})
export class ContainerFormComponent implements OnInit {
  containerForm: FormGroup;
  containerId: string | null = null;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private containersService: ContainersService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.containerForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit() {
    this.containerId = this.route.snapshot.paramMap.get('id');
    this.isEdit = this.router.url.includes('edit');

    if (this.containerId && this.isEdit) {
      this.loadContainer(this.containerId);
    }
  }

  async loadContainer(id: string) {
    const loading = await this.loadingController.create({
      message: 'Loading container...',
    });
    await loading.present();

    this.containersService.getContainer(id).subscribe(
      (container) => {
        this.containerForm.patchValue({
          name: container.name,
          description: container.description,
        });
        loading.dismiss();
      },
      (error) => {
        console.error('Error loading container', error);
        loading.dismiss();
        this.presentToast('Error loading container');
      }
    );
  }

  async saveContainer() {
    if (this.containerForm.invalid) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Saving container...',
    });
    await loading.present();

    const containerData = this.containerForm.value;

    try {
      if (this.isEdit && this.containerId) {
        await this.containersService.updateContainer({
          id: this.containerId,
          ...containerData,
        });
        this.presentToast('Container updated successfully');
      } else {
        await this.containersService.addContainer(containerData);
        this.presentToast('Container created successfully');
      }
      this.router.navigate(['/containers']);
    } catch (error) {
      console.error('Error saving container', error);
      this.presentToast('Error saving container');
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
