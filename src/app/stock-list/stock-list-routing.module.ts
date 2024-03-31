import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockListPage } from './stock-list.page';

const routes: Routes = [
  {
    path: '',
    component: StockListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockListPageRoutingModule {}
