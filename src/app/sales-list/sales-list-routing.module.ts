import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesListPage } from './sales-list.page';

const routes: Routes = [
  {
    path: '',
    component: SalesListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesListPageRoutingModule {}
