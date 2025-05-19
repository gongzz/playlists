import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { ThingsListComponent } from './things-list/things-list.component';
import { ThingDetailComponent } from './thing-detail/thing-detail.component';
import { ThingFormComponent } from './thing-form/thing-form.component';

const routes: Routes = [
  {
    path: '',
    component: ThingsListComponent
  },
  {
    path: 'new',
    component: ThingFormComponent
  },
  {
    path: 'edit/:id',
    component: ThingFormComponent
  },
  {
    path: ':id',
    component: ThingDetailComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ThingsListComponent,
    ThingDetailComponent,
    ThingFormComponent
  ],
  declarations: [

  ]
})
export class ThingsModule { }
