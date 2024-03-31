import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-bascule',
  templateUrl: './bascule.page.html',
  styleUrls: ['./bascule.page.scss'],
})
export class BasculePage implements OnInit {

  receivedData: string = '0';
  readInterval: any;

  metal: any;
  costo: any;

  constructor(public headerComponent: HeaderComponent,public navCtrl: NavController, private alertCtrl: AlertController, private bluetoothSerial: BluetoothSerial, private toastCtrl: ToastController,private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const metalId = params['metalId'];
      this.select_metal({ detail: { value: metalId } });
    });

  }

  ionViewWillEnter() {
    this.headerComponent.connect('00:23:05:00:3B:F3');
    this.startReadingBluetoothData();
    this.deviceConnected();
    
  }
  

  deviceConnected() {
    this.bluetoothSerial.subscribe("\n").subscribe(success => {
      this.handleData(success);
      this.showToast("Conectado correctamente");
    }, error => {
      this.showError(error);
    });
  }

  handleData(data: any) {
    this.receivedData = data.trim();
  }


   startReadingBluetoothData() {
    this.readInterval = setInterval(() => {
      this.readBluetoothData();
    }, 2000); 
  }

  readBluetoothData() {
    this.bluetoothSerial.read().then(
      (data) => {
        if (data.length > 0) {
          this.handleData(data);
        }
      },
      (error) => {
        this.showError('Error al leer datos del Bluetooth: ' + error);
      }
    );
  }

  stopReadingBluetoothData() {
    clearInterval(this.readInterval);
  }

  ngOnDestroy() {
    this.stopReadingBluetoothData();
  }

  async showError(message: string) {
    const alert = await this.alertCtrl.create({
      header: '¡Error!',
      message: message,
      buttons: ['dismiss']
    });
    await alert.present();
  }

  async showToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 5000
    });
    await toast.present();
  }

  select_metal(event: any) {
    const selectedValue = event.detail.value;
    switch (selectedValue) {
      case "1":
        this.metal = "Oro 10k Mexicano";
        this.costo = 100;
        break;
      case "2":
        this.metal = "Oro 14k Mexicano";
        this.costo = 150;
        break;
      case "3":
        this.metal = "Oro 10k Italiano";
        this.costo = 130;
        break;
      case "4":
        this.metal = "Oro 14k Italiano";
        this.costo = 200;
        break;
      case "5":
        this.metal = "Plata .925";
        this.costo = 30;
        break;
      default:
        this.metal = "";
    }

  }

  enviarAlCarrito() {
    const carritoActual = JSON.parse(localStorage.getItem('metal_articulo') || '[]');

    const producto = {
      descripcion: this.metal,
      precio: this.costo,
      cantidad: 999999,
      cantidad_comprar: this.receivedData
    };

    carritoActual.push(producto);

    localStorage.setItem('metal_articulo', JSON.stringify(carritoActual));
  }

}
