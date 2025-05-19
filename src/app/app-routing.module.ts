import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './common/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'things',
    loadChildren: () => import('./things/things.module').then( m => m.ThingsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'containers',
    loadChildren: () => import('./containers/containers.module').then( m => m.ContainersModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tags',
    loadChildren: () => import('./tags/tags.module').then( m => m.TagsModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
