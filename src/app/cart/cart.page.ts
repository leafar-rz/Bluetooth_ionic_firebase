import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { AlertController, ToastController } from '@ionic/angular';

import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  carrito: any[] = [];
  highlightedDates: any[] = [1];
  highlightedDates2: any[] = [];
  selectedDate: string;
  fromDate: any;
  toDate: any;
  from_date = false;
  to_date = false;
  clientes_list = false;
  clientes: Observable<any[]>;
  cliente_seleccionado: any;
  cliente_seleccionado_nombre: any= "Seleccionar cliente";
  total_pagar: any;

  metal_carrito: any[] = []; 

  constructor(public headerComponent: HeaderComponent,private toastCtrl: ToastController, private alertCtrl: AlertController, private firestore: AngularFirestore, private bluetoothSerial: BluetoothSerial) {
    this.selectedDate = new Date().toISOString(); 
    this.fromDate = this.selectedDate.split('T')[0];
    this.clientes = new Observable<any[]>(); 
  }

  ngOnInit() {
    this.carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    this.metal_carrito = JSON.parse(localStorage.getItem('metal_articulo') || '[]');
    console.log(this.metal_carrito);
    this.clientes = this.firestore.collection('CLIENTES').valueChanges();
  }

  ionViewWillEnter() {
    this.carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    this.metal_carrito = JSON.parse(localStorage.getItem('metal_articulo') || '[]');
    console.log(this.metal_carrito);
    this.clientes = this.firestore.collection('CLIENTES').valueChanges();
    this.headerComponent.connect('86:67:7A:14:44:46');
  }

  onDateChangeFromDate(event: any) {
    const selectedDate = event.detail.value.split('T')[0];

    this.fromDate = selectedDate;

    this.highlightedDates = [{
      date: selectedDate,
      textColor: 'var(--ion-color-secondary-contrast)',
      backgroundColor: 'var(--ion-color-secondary)',
    }];
    alert("Fecha agregada");

    this.selectedDate = new Date().toISOString();
    this.from_date = false;
    this.to_date = true;
  }

  onDateChangeToDate(event: any) {
    const selectedDate = event.detail.value.split('T')[0];

    this.toDate = selectedDate;

    this.highlightedDates2 = [{
      date: selectedDate,
      textColor: 'var(--ion-color-secondary-contrast)',
      backgroundColor: 'var(--ion-color-secondary)',
    }];
    alert("Fecha agregada");

    this.selectedDate = new Date().toISOString();
    this.to_date = false;
  }

  from_date_method() {
    this.from_date = !this.from_date;
    this.to_date = false
  }

  to_date_method() {
    this.to_date = !this.to_date;
    this.from_date = false;
  }

  removeFromCart(index: number) {
    this.carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  removeFromCart2(index: number) {
    this.metal_carrito.splice(index, 1);
    localStorage.setItem('metal_articulo', JSON.stringify(this.carrito));
  }

  seleccionarCliente(cliente: any) {
    this.clientes_list = false;
    this.cliente_seleccionado = cliente;
    this.cliente_seleccionado_nombre = cliente.nombre;
    console.log(this.cliente_seleccionado_nombre);

    console.log("Cliente seleccionado:", this.cliente_seleccionado);
  }

  show_clients() {
    this.clientes_list = !this.clientes_list
  }

  async send_printer() {



    if (this.cliente_seleccionado && this.toDate) {

      let mensaje = this.construirMensaje(this.cliente_seleccionado, this.carrito, this.metal_carrito);

      try {
        await this.bluetoothSerial.write(mensaje);
        alert("Impresión exitosa");
      } catch (error) {
        alert("Error al imprimir: " + error);
      }
    } else {
      alert("Tienes que seleccionar primero un cliente para poder enviarle su comprobante");
    }
  }

  send_whatsapp() {
    if (this.cliente_seleccionado && this.toDate && (this.carrito.length > 0 || this.metal_carrito.length > 0)) {

      let mensaje = this.construirMensaje(this.cliente_seleccionado, this.carrito, this.metal_carrito);

      const numeroWhatsapp = this.cliente_seleccionado.telefono;
      const mensajeWhatsapp = mensaje;
      const whatsappLink = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensajeWhatsapp)}`;

      window.open(whatsappLink, '_blank');

    } else {
      alert("Tienes que seleccionar primero un cliente para poder enviarle su comprobante");
    }


  }

  construirMensaje(clienteSeleccionado: any, carrito: any[], metal: any[]) {

    let mensaje = `Buen dia, te compartimos el recibo de tu compra\n\n`;

    mensaje += `Cliente: ${clienteSeleccionado.nombre} con domicilio: ${clienteSeleccionado.domicilio}\n\nProductos en el carrito:\n`;

    carrito.forEach((producto, index) => {
      mensaje += `- ${producto.cantidad_comprar} ${producto.descripcion} de  $${producto.precio} = $${producto.precio * producto.cantidad_comprar}\n`;
    });

    metal.forEach((producto, index) => {
      mensaje += `- ${producto.cantidad_comprar} gramos de ${producto.descripcion} de  $${producto.precio} = $${producto.precio * producto.cantidad_comprar}\n`;
    });

    mensaje += `\nTotal: $${this.total_pagar}\n\n`;
    mensaje += `Gracias por tu compra\n\n\n`;

    return mensaje;

  }


  validateCantidad(index: number) {
    if (this.carrito[index].cantidad_comprar < 0) {
      alert("La cantidad no puede ser menor a 1");
      this.carrito[index].cantidad_comprar = null;
    }

    if (this.carrito[index].cantidad_comprar > this.carrito[index].cantidad) {
      alert("No hay suficientes existencias, stock:" + this.carrito[index].cantidad);
      this.carrito[index].cantidad_comprar = this.carrito[index].cantidad;
    }
  }

  getTotal(): number {
    let total_pagar_unitario = this.carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad_comprar), 0);
    let total_pagar_metal = this.metal_carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad_comprar), 0);
    this.total_pagar = total_pagar_metal + total_pagar_unitario;
    return this.total_pagar
  }

  connect(address: any) {
    this.bluetoothSerial.connect(address).subscribe(success => {
      this.showToast("Conectado correctamente");
    }, error => {
      this.showError("No se ha podido conectar, algo ha fallado." + error);
    });
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

  clearStorage(){
    localStorage.clear();
    window.location.reload(); // Recarga la página actual
  }


}
