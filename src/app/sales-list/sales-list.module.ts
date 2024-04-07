import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesListPageRoutingModule } from './sales-list-routing.module';

import { SalesListPage } from './sales-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesListPageRoutingModule
  ],
  declarations: [SalesListPage]
})
export class SalesListPageModule {}
