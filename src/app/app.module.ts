import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

// Importaciones de Firebase y AngularFire
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

// Importación de la configuración de Firebase desde environment
import { environment } from '../environments/environment';

import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [AppComponent,
  HeaderComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,AngularFireModule.initializeApp(environment.firebaseConfig),
AngularFirestoreModule,
AngularFireAuthModule,
AngularFireStorageModule
],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },BluetoothSerial],
  bootstrap: [AppComponent],
})
export class AppModule {}
