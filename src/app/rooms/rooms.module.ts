import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { RoomsListComponent } from './rooms-list/rooms-list.component';
import { RoomDetailComponent } from './room-detail/room-detail.component';
import { RoomFormComponent } from './room-form/room-form.component';

const routes: Routes = [
  {
    path: '',
    component: RoomsListComponent
  },
  {
    path: 'new',
    component: RoomFormComponent
  },
  {
    path: 'edit/:id',
    component: RoomFormComponent
  },
  {
    path: ':id',
    component: RoomDetailComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    RoomDetailComponent,
    RoomsListComponent,
    RoomFormComponent
  ],
  declarations: [
  ]
})
export class RoomsModule { }
