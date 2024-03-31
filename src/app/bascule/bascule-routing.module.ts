import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BasculePage } from './bascule.page';

const routes: Routes = [
  {
    path: '',
    component: BasculePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BasculePageRoutingModule {}
