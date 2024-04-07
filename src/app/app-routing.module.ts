import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

const routes: Routes = [
  {
    path: 'header',
        component: HeaderComponent,
        children: [
          
          {
            path: 'home',
            loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
          },
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'home',
          },
          {
            path: 'cart',
            loadChildren: () => import('./cart/cart.module').then( m => m.CartPageModule)
          },
          {
            path: 'cart',
            redirectTo: 'cart',
            pathMatch: 'full'
          },
          {
            path: 'bascule',
            loadChildren: () => import('./bascule/bascule.module').then( m => m.BasculePageModule)
          },
          {
            path: 'bascule',
            redirectTo: 'bascule',
            pathMatch: 'full'
          },
          {
            path: 'stock-list',
            loadChildren: () => import('./stock-list/stock-list.module').then( m => m.StockListPageModule)
          },
          {
            path: 'stock-list',
            redirectTo: 'stock-list',
            pathMatch: 'full'
          },
          {
            path: 'sales-list',
            loadChildren: () => import('./sales-list/sales-list.module').then( m => m.SalesListPageModule)
          },
          {
            path: 'sales-list',
            redirectTo: 'sales-list',
            pathMatch: 'full'
          },
        ],
      },
      {
        path: '',
        redirectTo: 'header/home',
        pathMatch: 'full'
      },
  
 /*  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }, */
  /* {
    path: 'stock-list',
    loadChildren: () => import('./stock-list/stock-list.module').then( m => m.StockListPageModule)
  },
  {
    path: 'stock-list',
    redirectTo: 'stock-list',
    pathMatch: 'full'
  }, */
 /*  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'cart',
    redirectTo: 'cart',
    pathMatch: 'full'
  }, */
  /* {
    path: 'bascule',
    loadChildren: () => import('./bascule/bascule.module').then( m => m.BasculePageModule)
  },
  {
    path: 'bascule',
    redirectTo: 'bascule',
    pathMatch: 'full'
  }, */
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
