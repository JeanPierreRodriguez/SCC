import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { fromEvent} from 'rxjs';
import {DepartamentoDataSource} from './departamento.dataservice';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {ServiciosDirecciones} from 'src/app/core/servicios/direcciones';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {VentanaEmergenteDepartamento} from './ventana-emergente/ventanaemergente';
import {VentanaConfirmarComponent} from 'src/app/compartido/componentes/ventana-confirmar/ventana-confirmar.component'

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css'],
  providers: [ServiciosDirecciones]
})
export class DepartamentoComponent implements OnInit {

  ListadoDepartamentos: DepartamentoDataSource;
  Columnas: string[] = ['numero', 'nombre', 'opciones'];
  public TotalResultados:number=0;

  @ViewChild('InputDepartamento', { static: true }) FiltroDepartamento: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private Servicio: ServiciosDirecciones,
    public DialogoDepartamentos: MatDialog
  ) {}

  ngOnInit() {
   this.ListadoDepartamentos = new DepartamentoDataSource(this.Servicio);
   this.ListadoDepartamentos.CargarDepartamentos('',0,10);
   this.ListadoDepartamentos.TotalResultados.subscribe(res=>this.TotalResultados=res)
 }

// tslint:disable-next-line:use-life-cycle-interface
ngAfterViewInit () {

   this.paginator.page
    .pipe(
      tap(()=>this.CargarData())
     ).subscribe();

   fromEvent(this.FiltroDepartamento.nativeElement, 'keyup')
   .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.paginator.pageIndex=0;
       this.CargarData();
     })
    ).subscribe();
 }

 CargarData() {
   this.ListadoDepartamentos.CargarDepartamentos(
   	this.FiltroDepartamento.nativeElement.value,
    this.paginator.pageIndex+1,
    this.paginator.pageSize,
	);
 }


 Agregar() {

   let VentanaDepartamento = this.DialogoDepartamentos.open(VentanaEmergenteDepartamento, {
     width: '350px'
   });

   VentanaDepartamento.afterClosed().subscribe(res => {
     this.CargarData();
   });
 }

 Eliminar(departamento) {
   let VentanaDepartamento = this.DialogoDepartamentos.open(VentanaConfirmarComponent,{
     width: '400px',
     data: {objeto: 'el departamento', valor: departamento.descripcion}
   });
   VentanaDepartamento.afterClosed().subscribe(res=>{
     if(res==true){
      this.Servicio.EliminarDepartamento(departamento.id).subscribe(res=>{
        this.CargarData();
      })
     }
   })
 }

 Editar(id) {
   this.Servicio.SeleccionarDepartamento(id).subscribe(res => {

     let VentanaDepartamento = this.DialogoDepartamentos.open(VentanaEmergenteDepartamento, {
       width: '350px',
       data: res
     });
     // tslint:disable-next-line:no-shadowed-variable
     VentanaDepartamento.afterClosed().subscribe (res => {
       this.CargarData();
     });
   });
 }
}
