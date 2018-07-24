import { VentanaEmergenteProductos } from './ventana-emergente/ventanaemergente';
import {Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import {merge, Observable} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {ProductoService} from './productos.service';
import {ProductoDataSource} from './productos.dataservice';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';
import {VentanaConfirmarComponent} from './ventana-confirmar/ventana-confirmar.component'

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  providers: [ProductoService]
})

export class ProductosComponent implements OnInit {

  ListadoProductos: ProductoDataSource;
  Columnas: string[] = ['numero', 'descripcion', 'tipo', 'marca', 'modelo', 'unidad_medida', 'opciones'];
  public maestro;

  @ViewChild('InputProducto') FiltroProductos: ElementRef;
  @ViewChild('InputTipo') FiltroTipo: ElementRef;
  @ViewChild('InputMarca') FiltroMarca: ElementRef;
  @ViewChild('InputModelo') FiltroModelo: ElementRef;

  constructor(
    private Servicio: ProductoService,
    public DialogoProductos: MatDialog
  ) {}

  ngOnInit() {
   this.ListadoProductos = new ProductoDataSource(this.Servicio);
   this.ListadoProductos.CargarProductos('', '', '', '');
 }

// tslint:disable-next-line:use-life-cycle-interface
ngAfterViewInit () {
   fromEvent(this.FiltroProductos.nativeElement, 'keyup')
   .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.CargarData();
     })
    ).subscribe();

   fromEvent(this.FiltroTipo.nativeElement, 'keyup')
   .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.CargarData();
     })
    ).subscribe();

    fromEvent(this.FiltroMarca.nativeElement, 'keyup')
   .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.CargarData();
     })
    ).subscribe();

   fromEvent(this.FiltroModelo.nativeElement, 'keyup')
   .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.CargarData();
     })
    ).subscribe();
 }

 CargarData() {
   this.ListadoProductos.CargarProductos(this.FiltroTipo.nativeElement.value,
   this.FiltroMarca.nativeElement.value,
   this.FiltroModelo.nativeElement.value,
   this.FiltroProductos.nativeElement.value);
 }


 /* Agregar productos */
 Agregar() {
   // tslint:disable-next-line:prefer-const
   let VentanaProductos = this.DialogoProductos.open(VentanaEmergenteProductos, {
     width: '800px'
   });

   VentanaProductos.afterClosed().subscribe(res => {
     this.CargarData();
   });
 }

 /* Eliminar productos */
 Eliminar(producto) {
   let VentanaConfirmar = this.DialogoProductos.open(VentanaConfirmarComponent,{
     width: '400px',
     data: producto
   });
   VentanaConfirmar.afterClosed().subscribe(res=>{
     this.CargarData();
   })
 }

 /* Editar productos */
 Editar(id) {
   this.Servicio.Seleccionar(id).subscribe(res => {
     // tslint:disable-next-line:prefer-const
     let VentanaProductos = this.DialogoProductos.open(VentanaEmergenteProductos, {
       width: '800px',
       data: res
     });
     // tslint:disable-next-line:no-shadowed-variable
     VentanaProductos.afterClosed().subscribe (res => {
       this.CargarData();
     });
   });
 }
}
