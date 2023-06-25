import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { UploadComponent } from './upload/upload.component';

// {authOnly = true} will let angular redirect to home page after logout
const routes: Routes = [
  {
    path: 'manage',
    component: ManageComponent,
    data: {
      authOnly: true,
    },
  },
  {
    path: 'upload',
    component: UploadComponent,
    data: {
      authOnly: true,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoRoutingModule { }
