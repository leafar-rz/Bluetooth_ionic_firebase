import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BasculePageRoutingModule } from './bascule-routing.module';

import { BasculePage } from './bascule.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BasculePageRoutingModule
  ],
  declarations: [BasculePage]
})
export class BasculePageModule {}
