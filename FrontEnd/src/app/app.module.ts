import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';

import {routing, appRoutingProvider} from './app.routing';

/* Imports del software */
import {AppComponent} from './app.component';
import {MenuComponent} from './menu/menu.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ProductosComponent } from './components/productos/productos.component';
import { StockComponent } from './components/stock/stock.component';
import { IngresoProductosComponent } from './components/ingreso-productos/ingreso-productos.component';
import { SalidaProductosComponent } from './components/salida-productos/salida-productos.component';
import { SalidaVendedoresComponent } from './components/salida-vendedores/salida-vendedores.component';
import { RetornoVendedoresComponent } from './components/retorno-vendedores/retorno-vendedores.component';
import { ComisionesComponent } from './components/comisiones/comisiones.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { VentasComponent } from './components/ventas/ventas.component'

@NgModule({
  imports: [
  	/* Angular Material */
    CdkTableModule,
    CdkTreeModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
  	/* Angular Material */
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    LayoutModule,
    routing,
  ],
  declarations: [
    AppComponent,
    MenuComponent,
    UsuariosComponent,
    ProductosComponent,
    StockComponent,
    IngresoProductosComponent,
    SalidaProductosComponent,
    SalidaVendedoresComponent,
    RetornoVendedoresComponent,
    ComisionesComponent,
    ClientesComponent,
    VentasComponent
   ],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent],
  providers: [appRoutingProvider]
})
export class AppModule {}