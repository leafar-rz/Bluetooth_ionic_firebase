import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  pairedList: PairedDevice[] | undefined;
  listToggle: boolean = false;
  pairedDeviceId: number = 0;
  isConnected: boolean = false;
  receivedData: string = '0';
  readInterval: any;
  connectedDeviceAddress: string | null = null;

  showDeviceList: boolean = false;

  constructor(private ngZone: NgZone,public navCtrl: NavController, private alertCtrl: AlertController, private bluetoothSerial: BluetoothSerial, private toastCtrl: ToastController, private route: ActivatedRoute, private router: Router) {
    this.checkBluetoothEnable();
  }

  ngOnInit() {

  }

  checkBluetoothEnable() {
    this.bluetoothSerial.isEnabled().then(success => {
      this.listPairedDevices();
    }, error => {
      this.showError("Por favor, activa el Bluetooth");
    });
  }

  listPairedDevices() {
    this.bluetoothSerial.list().then(success => {
      this.pairedList = success;
      this.listToggle = true;
      // Inicia la lectura continua al obtener la lista de dispositivos emparejados
      //this.startReadingBluetoothData();
    }, error => {
      this.showError("Ha sucedido un error al recuperar la lista, inténtalo de nuevo");
      this.listToggle = false;
    });
  }

  async selectDevice(index: number) {

    if (this.pairedList && this.pairedList.length > index) {
      let connectedDevice = this.pairedList[index];
      if (connectedDevice && connectedDevice.address) {
        let address = connectedDevice.address;
        this.connect(address);

      } else {
        this.showError("Dispositivo seleccionado no válido");
      }
    } else {
      this.showError("Índice de dispositivo no válido");
    }
  }

  async connect(address: any) {

    if (this.isConnected) {
      await this.deviceDisconnect2()
      await this.delay(1000); // Esperar 2 segundos después de desconectarse
    }
    
    this.bluetoothSerial.connect(address).subscribe(success => {
      this.ngZone.run(() => { // Ejecutar dentro de la zona Angular
        this.connectedDeviceAddress = address;
        this.showToast("Conectado correctamente");
        this.isConnected = true;
      });
    }, error => {
      this.ngZone.run(() => { // Ejecutar dentro de la zona Angular
        this.showError("No se ha podido conectar, algo ha fallado." + error);
      });
    });
  }


  deviceDisconnect2() {
    this.bluetoothSerial.disconnect();
    this.isConnected = false;
    this.connectedDeviceAddress = null; // Restablece la dirección del dispositivo conectado
  }

  deviceDisconnect() {
    this.bluetoothSerial.disconnect();
    this.showToast("Se ha desconectado del dispositivo");
    this.isConnected = false;
    this.connectedDeviceAddress = null; // Restablece la dirección del dispositivo conectado
  }

  // Función para crear un retraso
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

  showDevices(event: any) {
    this.showDeviceList = !this.showDeviceList; // Alternar la visibilidad de la lista
    event.stopPropagation(); // Evitar la propagación del evento para que el menú no se cierre
  }





















  /*  deviceConnected() {
     this.isConnected = true;
     this.bluetoothSerial.subscribe("\n").subscribe(success => {
       this.handleData(success);
       this.showToast("Conectado correctamente");
     }, error => {
       this.showError(error);
     });
   }
 
   handleData(data: any) {
     this.receivedData = data.trim();
     //let dataArray = this.receivedData.split(' ');
   }
  */

  /*  async imprimirWifi() {
     
       if (this.isConnected) {
         try {
           await this.bluetoothSerial.write("Texto a imprimir\n");
           alert("Impresión exitosa");
         } catch (error) {
          alert("Error al imprimir: " + error);
         }
       } else {
         alert("No estás conectado a ninguna impresora");
       }
       
     } */


}

interface PairedDevice {
  class: number;
  id: string;
  address: string;
  name: string;
}
