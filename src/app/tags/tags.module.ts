import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { TagsListComponent } from './tags-list/tags-list.component';
import { TagDetailComponent } from './tag-detail/tag-detail.component';
import { TagFormComponent } from './tag-form/tag-form.component';

const routes: Routes = [
  {
    path: '',
    component: TagsListComponent
  },
  {
    path: 'new',
    component: TagFormComponent
  },
  {
    path: 'edit/:id',
    component: TagFormComponent
  },
  {
    path: ':id',
    component: TagDetailComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TagDetailComponent,
    TagsListComponent,
    TagFormComponent
  ],
  declarations: [

  ]
})
export class TagsModule { }
