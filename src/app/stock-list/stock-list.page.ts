import { Component, OnInit} from '@angular/core';
//import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.page.html',
  styleUrls: ['./stock-list.page.scss'],
})
export class StockListPage implements OnInit {
  input_add=1
  enableButton: boolean = true;
  productos: Observable<any[]>;
  categorias: Observable<any[]>;

  constructor(private firestore: AngularFirestore) { 
    this.productos = new Observable<any[]>(); // inicializando en el constructor
    this.categorias = new Observable<any[]>(); // inicializando en el constructor
  }

  ngOnInit() {
    this.productos = this.firestore.collection('ARTICULOS').valueChanges();
    this.categorias = this.firestore.collection('CATEGORIAS').valueChanges();
    this.categorias.subscribe(categorias => {
      console.log('categorias:', categorias);
    });
    
  }

  addToCart(producto: any) {
    const carritoActual = JSON.parse(localStorage.getItem('carrito') || '[]');
    // Agregar el valor input_add al producto
    producto.cantidad_comprar = this.input_add;
    carritoActual.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carritoActual));
  }

  checkInput() {
    this.enableButton = this.input_add > 0;
  }

  onCategoriaSeleccionada(categoria_id:any)
  {
    if(categoria_id==6)
    {
      this.productos = this.firestore.collection('ARTICULOS').valueChanges();
    }else{
      this.productos = this.firestore.collection('ARTICULOS', ref => ref.where('categoria_id', '==', categoria_id)).valueChanges();
    }
 
  }


  
}