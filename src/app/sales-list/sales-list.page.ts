import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, ToastController } from '@ionic/angular';
import { getFirestore, doc, updateDoc, increment, getDoc, setDoc } from 'firebase/firestore';

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.page.html',
  styleUrls: ['./sales-list.page.scss'],
})
export class SalesListPage implements OnInit {

  telefono_cliente: any = "";
  ventas: Observable<any[]>;
  estatus: any = "TODOS";
  venta_abonar: any;
  cantidad_abonar: any;
  popUp = false;
  varValidarBoton = false;

  constructor(private toastCtrl: ToastController, private alertCtrl: AlertController, private firestore: AngularFirestore) {
    this.ventas = new Observable<any[]>(); // inicializando en el constructor
  }

  ngOnInit() {
    this.ventas = this.firestore.collection('VENTAS').valueChanges();

  }

  estatusSeleccionado(estatus: any) {
    this.estatus = estatus;
    switch (estatus) {
      case "PAGADO":
        this.ventas = this.firestore.collection('VENTAS', ref => ref.where('estatus', '==', this.estatus.toString())).valueChanges();
        this.ventas.subscribe(ventas => {
          if (ventas.length === 0) {
            this.showError("Ventas no encontradas");
            this.telefono_cliente = "";
          }
        });
        break;
      case "PENDIENTE":
        this.ventas = this.firestore.collection('VENTAS', ref => ref.where('estatus', '==', this.estatus.toString())).valueChanges();
        this.ventas.subscribe(ventas => {
          if (ventas.length === 0) {
            this.showError("Ventas no encontradas");
            this.telefono_cliente = "";
          }
        });
        break;
      case "TODOS":
        this.ventas = this.firestore.collection('VENTAS').valueChanges();
        break;
      default:
        break;
    }
  }


  search() {
    if (this.telefono_cliente.toString().length == 10) {
      if (this.estatus != 'TODOS') {
        this.ventas = this.firestore.collection('VENTAS', ref => ref
          .where('cliente_telefono', '==', this.telefono_cliente.toString())
          .where('estatus', '==', this.estatus.toString())
        ).valueChanges();
      } else {
        this.ventas = this.firestore.collection('VENTAS', ref => ref.where('cliente_telefono', '==', this.telefono_cliente.toString())).valueChanges();
      }
      this.ventas.subscribe(ventas => {
        if (ventas.length === 0) {
          this.showError("Ventas no encontradas");
          this.telefono_cliente = "";
        }
      });
      this.telefono_cliente = "";
    } else {
      this.showError("Debes agregar un telefono de 10 digitos para poder buscar");
    }
  }

  async showError(message: string) {
    const alert = await this.alertCtrl.create({
      header: '¡Error!',
      message: message,
      buttons: ['Ok']
    });
    await alert.present();
  }

  async showToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    await toast.present();
  }

  mostrarDivAbonar(venta: any) {
    this.venta_abonar = venta;
    if (venta.saldo_pendiente > 0) {
      this.showPopUp();
    }
    else {
      this.showToast("No se puede abonar a esta venta ya que no se debe nada");
    }

  }

  showPopUp() {
    this.popUp = !this.popUp;
  }

  async abonar() {
    if (this.cantidad_abonar <= 0 || this.cantidad_abonar == undefined) {
      this.showError("No puedes abonar cantidades negativas");
    } else if (this.cantidad_abonar > this.venta_abonar.saldo_pendiente) {
      this.showError("No puedes abonar más del saldo pendiente");
    } else {


      try {
        const db = getFirestore();
        const ventaDocRef = doc(db, 'VENTAS', this.venta_abonar.id.toString());
        let nuevoSaldo = this.venta_abonar.saldo_pendiente - this.cantidad_abonar;

        if(nuevoSaldo==0){
          await updateDoc(ventaDocRef, {
            saldo_pendiente: (nuevoSaldo),
            estatus: 'PAGADO'
          });
        }else{
          await updateDoc(ventaDocRef, {
            saldo_pendiente: (nuevoSaldo)
          });
        }
        

        const clienteDocRef = doc(db, 'CLIENTES', this.venta_abonar.cliente_id.toString());
        const clienteDocSnapshot = await getDoc(clienteDocRef);
        const clienteData = clienteDocSnapshot.data();

        if (clienteData) {
          // Calcular nuevo saldo del cliente
          nuevoSaldo = clienteData['saldo'] - this.cantidad_abonar;

          // Actualizar documento del cliente
          await updateDoc(clienteDocRef, {
              saldo: nuevoSaldo
          });

          this.showToast("Abono exitoso");
          this.showPopUp();

          this.cantidad_abonar="";
      } else {
          // Manejar el caso donde clienteData está indefinido
          console.error("No se pudo obtener los datos del cliente");
      }


      } catch (error) {
        alert('Error al incrementar contador de ventas:' + error);
      }


    }

  }


}
