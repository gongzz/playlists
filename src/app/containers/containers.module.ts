import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { ContainersListComponent } from './containers-list/containers-list.component';
import { ContainerDetailComponent } from './container-detail/container-detail.component';
import { ContainerFormComponent } from './container-form/container-form.component';

const routes: Routes = [
  {
    path: '',
    component: ContainersListComponent
  },
  {
    path: 'new',
    component: ContainerFormComponent
  },
  {
    path: 'edit/:id',
    component: ContainerFormComponent
  },
  {
    path: ':id',
    component: ContainerDetailComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ContainersListComponent,
    ContainerDetailComponent,
    ContainerFormComponent
  ],
  declarations: [

  ]
})
export class ContainersModule { }
