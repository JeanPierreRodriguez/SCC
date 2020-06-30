import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit,Inject, ViewChildren, QueryList, Optional } from '@angular/core';
import {FormArray, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {VentaService} from '../ventas/ventas.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import {ServiciosTipoDocumento, TipoDocumento} from '../global/tipodocumento';
import {ServiciosTipoPago, TipoPago} from '../global/tipopago';
import {ClienteService } from '../clientes/clientes.service';
import { forkJoin,fromEvent, merge, BehaviorSubject} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import {ServiciosTelefonos} from '../global/telefonos';
import {ServiciosDirecciones} from '../global/direcciones';
import {ServiciosGenerales} from '../global/servicios';
// import {VentanaProductosComponent} from './ventana-productos/ventana-productos.component';
import { FileHolder } from 'angular2-image-upload';
import * as moment from 'moment';
import {Location} from '@angular/common';
import {Notificaciones} from '../global/notificacion';
import {URLIMAGENES} from '../global/url'
import {VentanaCronogramaComponent} from '../ventas/ventana-cronograma/ventana-cronograma.component';
import { SalidaVendedoresService } from "../salida-vendedores/salida-vendedores.service";
import { VentanaEmergenteContacto} from '../clientes/ventana-emergentecontacto/ventanaemergentecontacto';
import {SeleccionarClienteComponent} from '../retorno-vendedores/seleccionar-cliente/seleccionar-cliente.component';
import { SeguimientosService } from "../seguimientos/seguimientos.service";
import { VentanaCrearCobranzaManualComponent } from "../cobranza-manual/ventana-crear-cobranza-manual/ventana-crear-cobranza-manual.component";
import { Rol } from "../usuarios/usuarios.service";
import { EstadoSesion } from "../usuarios/usuarios.reducer";
import { Store } from "@ngrx/store";

@Component({
  selector: 'app-ventas-salida',
  templateUrl: './ventas-salida.component.html',
  styleUrls: ['./ventas-salida.component.scss'],
  providers: [VentaService, ServiciosTipoDocumento, ServiciosTipoPago, ClienteService, ServiciosTelefonos, ServiciosDirecciones, ServiciosGenerales, Notificaciones, SalidaVendedoresService]
})

export class VentasSalidaComponent implements OnInit, AfterViewInit {

  public Cargando = new BehaviorSubject<boolean>(true);
  public id_venta: number;
  public id_venta_editar: number;
  public id_salida: number;
  public productos: FormArray;
  public garantes: FormArray;
  public Vendedores:Array<any> = [];
  public Productos:Array<any>;
  public Cronograma: Array<any>;
  public VentasSalidaForm:FormGroup;
  public ListadoVentas: VentaDataSource;
  public Columnas: string[];
  public ruta:string;
  public ProductosComprados: Array<any>;
  public ListadoTipoPago: Array<any>;
  public ListadoProductos: Array<any>;
  public ListadoProductosOriginal: Array<any>; // Usado como referencia para restaurar elementos que se eliminen en el arreglo anterior
  public diferencia : number = 0;
  public editar_cronograma : number = 0;

  public numero_contrato: string;

  @ViewChild('InputInicial', { static: true }) FiltroInicial: ElementRef;
  @ViewChild('InputCuota', { static: true }) FiltroCuota: ElementRef;
  @ViewChildren('InputPrecio') FiltroPrecio:QueryList<any>;
  @ViewChild(MatSort) sort: MatSort;

  public foto: string;
  public dni: string;
  public cip: string;
  public contrato: string;
  public transaccion: string;
  public planilla: string;
  public letra: string;
  public autorizacion: string;
  public otros: string;
  public papeles : string = "";

  public foto_nuevo: string;
  public dni_nuevo: string;
  public cip_nuevo: string;
  public contrato_nuevo: string;
  public transaccion_nuevo: string;
  public planilla_nuevo: string;
  public letra_nuevo: string;
  public autorizacion_nuevo: string;
  public otros_nuevo: string;
  public papeles_antiguo : string = "";

  public foto_antiguo: string;
  public dni_antiguo: string;
  public cip_antiguo: string;
  public contrato_antiguo: string;
  public transaccion_antiguo: string;
  public planilla_antiguo: string;
  public letra_antiguo: string;
  public autorizacion_antiguo: string;
  public otros_antiguo: string;
  public papeles_nuevo : string = "";

  public foto_editar: boolean= false;
  public dni_editar: boolean= false;
  public cip_editar: boolean= false;
  public contrato_editar: boolean= false;
  public transaccion_editar: boolean= false;
  public planilla_editar: boolean= false;
  public letra_editar: boolean= false;
  public autorizacion_editar: boolean= false;
  public otros_editar: boolean= false;
  public papeles_editar : boolean = false;
  public total_cronograma_editado:number;

  public permiso : Rol ;

  constructor(
    private _store : Store<EstadoSesion> ,
    private Servicio: VentaService,
    private ClienteServicio: ClienteService,
    private DireccionServicio: ServiciosDirecciones,
    private ServiciosGenerales: ServiciosGenerales,
    private TelefonoServicio: ServiciosTelefonos,
    private Dialogo: MatDialog,
    private FormBuilder: FormBuilder,
    private ServicioTipoDocumento: ServiciosTipoDocumento,
    private ServicioTipoPago: ServiciosTipoPago,
    private SServicio: SalidaVendedoresService,
    private route: ActivatedRoute,
    private location: Location,
    private Notificacion: Notificaciones,
    private router: Router,
    private SgServicio : SeguimientosService,
  ) { }

  ngOnInit() {
    this._store.select('permisos').subscribe(permiso =>{
      if( permiso ) {
        this.permiso = permiso ;
      }
    })

    this.editar_cronograma=3;

    this.ruta=URLIMAGENES.urlimages;

    this.route.params.subscribe(params => {
      if(params['idventa']){
        this.Columnas= ['numero', 'monto_cuota','fecha_vencimiento', 'monto_interes','monto_pagado', 'fecha_cancelacion', 'monto_pendiente','estado', 'opciones'];
        this.id_venta = +params['idventa'];
        this.SeleccionarVentaxId(this.id_venta);
      }
      if(params['idventaeditar']){
        this.Columnas= ['numero', 'fecha_vencimiento_ver', 'monto_cuota_ver'];
        this.id_venta_editar = +params['idventaeditar'];
        this.SeleccionarVentaxId(this.id_venta_editar);
      }
    
    })

    this.CrearFormulario();
    this.ListadoVentas = new VentaDataSource(this.Servicio)
  }

  ngAfterViewInit(): void {

    if (this.id_venta) {
      this.sort.sortChange
      .pipe(
        tap(() =>{
          this.ActualizarOrdenCronograma(this.id_venta, this.sort.active + " " + this.sort.direction)
        })
      ).subscribe();
    }

    if(!this.id_venta){

      this.FiltroPrecio.changes.subscribe(res=>{
        for (let i in this.FiltroPrecio['_results']) {
          fromEvent(this.FiltroPrecio['_results'][i].nativeElement,'keyup')
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(()=>{
              if (this.FiltroPrecio['_results'][i]) {
                if (this.FiltroPrecio['_results'][i].nativeElement.value) {
                  // this.VentasForm.get('montototal').setValue(0);
                  this.CalcularTotales();
                }
              }
            })
          ).subscribe()
        }
      })
  
      merge(
        fromEvent(this.FiltroInicial.nativeElement,'keyup'),
        fromEvent(this.FiltroCuota.nativeElement,'keyup')
      ).pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(()=>{
          if (
            this.FiltroInicial.nativeElement.value &&
            this.FiltroCuota.nativeElement.value &&
            this.VentasSalidaForm.value.fechapago
          ) {
            this.CrearCronograma()
          }
        })
      ).subscribe()
    }
    
  }

  CrearFormulario(){

    this.VentasSalidaForm = this.FormBuilder.group({
      'id_salida': [{value: null, disabled: false}, [
      ]],
      'id_contrato': [{value: null, disabled: false}, [
      ]],
      'contrato': [{value: null, disabled: false}, [
        Validators.required
      ]],
      'tipodoc': [6, [
        Validators.required
      ]],
      'id_cliente': [null, [
        Validators.required
      ]],
      'cliente': [null, [
      ]],
      'dni': [null, [
      ]],
      'cargo': [null, [
      ]],
      'trabajo': [null, [
      ]],
      'direccion': [null, [
      ]],
      'telefono': [null, [
      ]],
      'garante': [false, [
        Validators.required
      ]],
      'pecosa': [{value: null, disabled: false}, [
        Validators.required
      ]],
      'lugar': ["", [
        Validators.required
      ]],
      'fechaventa': [{value: new Date(), disabled: false}, [
        Validators.required
      ]],
      'fechapago': [{value: new Date((new Date()).valueOf() + 1000*60*60*24*30), disabled: false}, [
        Validators.required
      ]],
      'tipopago': [null, [
        Validators.required
      ]],
      'montototal': [0, [
        Validators.required,
        Validators.pattern('[0-9- ]+')
      ]],
      'cuotas': [null, [
        Validators.required,
        Validators.pattern('[0-9- ]+')
      ]],
      'inicial': [0, [
        Validators.required,
        Validators.pattern('[0-9- ]+')
      ]],
      'observaciones': ["", [
      ]],
      productos: this.FormBuilder.array([]),
      garantes: this.FormBuilder.array([]),
      papeles : [ { value : null , disabled : false } ,[] ],
      papeles_id : [ { value : null , disabled : false } ,[] ],
      papeles_fecha_envio : [ { value : null , disabled : false } ,[] ],
      papeles_courier : [ { value : null , disabled : false } ,[] ],
      papeles_seguimiento : [ { value : null , disabled : false } ,[] ],
      papeles_observaciones : [ { value : null , disabled : false } ,[] ],
    });
  }

  SeleccionarVentaxId(id_venta){

    this.Servicio.SeleccionarVentaSalida(id_venta).subscribe(res=>{
      
      // console.log(res)

      this.id_salida = res.id_salida;

      this.numero_contrato=res.contrato;

      this.VentasSalidaForm.get('id_salida').setValue(res.id_salida);
      this.VentasSalidaForm.get('id_cliente').setValue(res.id_cliente);
      this.VentasSalidaForm.get('id_contrato').setValue(res.id_talonario);
      this.VentasSalidaForm.get('cliente').setValue(res.cliente_nombre);
      this.VentasSalidaForm.get('dni').setValue(res.cliente_dni);
      this.VentasSalidaForm.get('cargo').setValue(res.cliente_cargo_nombre);
      this.VentasSalidaForm.get('trabajo').setValue(res.cliente_trabajo);
      this.VentasSalidaForm.get('direccion').setValue(res.cliente_direccion_nombre);
      this.VentasSalidaForm.get('telefono').setValue(res.cliente_telefono_numero);
      this.VentasSalidaForm.get('pecosa').setValue(res.pecosa);
      this.VentasSalidaForm.get('lugar').setValue(res.lugar_venta);
      this.VentasSalidaForm.get('fechaventa').setValue(moment(res.fecha).toDate());
      this.VentasSalidaForm.get('fechapago').setValue(moment(res.fecha_inicio_pago).toDate());
      this.VentasSalidaForm.get('inicial').setValue(res.monto_inicial);
      this.VentasSalidaForm.get('cuotas').setValue(res.numero_cuotas);
      this.VentasSalidaForm.get('montototal').setValue(res.monto_total);
      this.VentasSalidaForm.get('contrato').setValue(res.contrato);
      
      this.Productos=res.productos.productos
      
      this.Cronograma=res.cronograma.cronograma;
      
      this.ListadoVentas.Informacion.next(this.Cronograma);
      
      this.SServicio.ListarComisiones(res.id_salida).subscribe(res=>{
        // console.log(res);
        this.Vendedores=res;
      })

      if(res['garantes'].garantes.length>0){
        
        this.VentasSalidaForm.get('garante').setValue(true);
        
        res['garantes'].garantes.forEach((item,index)=>{
          this.AgregarGarante(false);
          this.VentasSalidaForm['controls'].garantes['controls'][index].get('id_cliente').setValue(item.id_cliente);
          this.VentasSalidaForm['controls'].garantes['controls'][index].get('nombre').setValue(item.cliente_nombre);
          this.VentasSalidaForm['controls'].garantes['controls'][index].get('direccion').setValue(item.cliente_direccion);
          this.VentasSalidaForm['controls'].garantes['controls'][index].get('telefono').setValue(item.cliente_telefono);
        })
      }
      
      if( res['courier'].id ){
        this.VentasSalidaForm.get('papeles').setValue(true);
        this.VentasSalidaForm.get('papeles_id').setValue(res['courier'].id);
        this.VentasSalidaForm.get('papeles_fecha_envio').setValue(res['courier'].fecha);
        this.VentasSalidaForm.get('papeles_courier').setValue(res['courier'].id_courier);
        this.VentasSalidaForm.get('papeles_seguimiento').setValue(res['courier'].numero_seguimiento);
        this.VentasSalidaForm.get('papeles_observaciones').setValue(res['courier'].observacion);
        res['courier'].foto !="" ? this.papeles=URLIMAGENES.carpeta+'venta/'+res['courier'].foto : null;
      }

      if (this.id_venta) {

        // Ajustes visuales
        this.VentasSalidaForm.get('observaciones').setValue(res.observacion=="" ? "No hay observaciones" : res.observacion);

        // Datos diferentes
        this.VentasSalidaForm.get('tipopago').setValue(res.tipo_pago);

        this.ActualizarOrdenCronograma(this.id_venta,"fecha_vencimiento asc");

        this.foto = res.foto!="" ? URLIMAGENES.carpeta+'venta/'+res.foto : null;
        this.dni = res.dni_pdf!="" ? URLIMAGENES.carpeta+'venta/'+res.dni_pdf : null;
        this.cip = res.cip_pdf!="" ? URLIMAGENES.carpeta+'venta/'+res.cip_pdf : null;
        this.contrato = res.contrato_pdf!="" ? URLIMAGENES.carpeta+'venta/'+res.contrato_pdf : null;
        this.transaccion = res.voucher_pdf!="" ? URLIMAGENES.carpeta+'venta/'+res.voucher_pdf : null;
        this.planilla = res.planilla_pdf!="" ? URLIMAGENES.carpeta+'venta/'+res.planilla_pdf : null;
        this.letra = res.letra_pdf!="" ? URLIMAGENES.carpeta+'venta/'+res.letra_pdf : null;
        this.autorizacion = res.autorizacion_pdf!="" ? URLIMAGENES.carpeta+'venta/'+res.autorizacion_pdf : null;
        this.otros = res.otros_pdf!="" ? URLIMAGENES.carpeta+'venta/'+res.otros_pdf : null;

        if(res['garantes'].garantes.length>0){

          res['garantes'].garantes.forEach((item,index)=>{
  
            let dni = item.dni_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.dni_pdf : null ;
            let cip = item.cip_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.cip_pdf : null ;
            let planilla = item.planilla_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.planilla_pdf : null ;
            let letra = item.letra_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.letra_pdf : null ;
            let voucher = item.voucher_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.voucher_pdf : null ;
  
            this.VentasSalidaForm['controls'].garantes['controls'][index].get('dni_pdf').setValue(dni);
            this.VentasSalidaForm['controls'].garantes['controls'][index].get('cip_pdf').setValue(cip);
            this.VentasSalidaForm['controls'].garantes['controls'][index].get('planilla_pdf').setValue(planilla);
            this.VentasSalidaForm['controls'].garantes['controls'][index].get('letra_pdf').setValue(letra);
            this.VentasSalidaForm['controls'].garantes['controls'][index].get('transaccion_pdf').setValue(voucher);
          })
        }

      }

      if(this.id_venta_editar){

        if( res['courier'].id ){
          this.VentasSalidaForm.get('papeles_courier').setValue(res['courier'].id_courier);
          this.papeles_antiguo=res['courier'].foto;
          res['courier'].foto !="" ? this.papeles_editar=false : this.papeles_editar=true;
        }

        // Funciones importantes
        this.ListarTipoPago();
        this.ListarProductos();

        // AJustes visuales        
        this.VentasSalidaForm.get('pecosa').disable();
        this.VentasSalidaForm.get('contrato').disable();

        // Datos diferentes
        this.VentasSalidaForm.get('tipopago').setValue(res.idtipopago);

        // Sobre los documentos adjuntos
        this.foto_antiguo=res.foto;
        res.foto!="" ? this.foto=URLIMAGENES.carpeta+'venta/'+res.foto : null;
        res.foto!="" ? this.foto_editar=false : this.foto_editar=true;

        this.dni_antiguo=res.dni_pdf;
        res.dni_pdf!="" ? this.dni=URLIMAGENES.carpeta+'venta/'+res.dni_pdf : null;
        res.dni_pdf!="" ? this.dni_editar=false : this.dni_editar=true;

        this.cip_antiguo=res.cip_pdf;
        res.cip_pdf!="" ? this.cip=URLIMAGENES.carpeta+'venta/'+res.cip_pdf : null;
        res.cip_pdf!="" ? this.cip_editar=false : this.cip_editar=true;

        this.contrato_antiguo=res.contrato_pdf;
        res.contrato_pdf!="" ? this.contrato=URLIMAGENES.carpeta+'venta/'+res.contrato_pdf : null;
        res.contrato_pdf!="" ? this.contrato_editar=false : this.contrato_editar=true;

        this.transaccion_antiguo=res.voucher_pdf;
        res.voucher_pdf!="" ? this.transaccion=URLIMAGENES.carpeta+'venta/'+res.voucher_pdf : null;
        res.voucher_pdf!="" ? this.transaccion_editar=false : this.transaccion_editar=true;

        this.planilla_antiguo=res.planilla_pdf;
        res.planilla_pdf!="" ? this.planilla=URLIMAGENES.carpeta+'venta/'+res.planilla_pdf : null;
        res.planilla_pdf!="" ? this.planilla_editar=false : this.planilla_editar=true;

        this.letra_antiguo=res.letra_pdf;
        res.letra_pdf!="" ? this.letra=URLIMAGENES.carpeta+'venta/'+res.letra_pdf : null;
        res.letra_pdf!="" ? this.letra_editar=false : this.letra_editar=true;

        this.autorizacion_antiguo=res.autorizacion_pdf;
        res.autorizacion_pdf!="" ? this.autorizacion=URLIMAGENES.carpeta+'venta/'+res.autorizacion_pdf : null;
        res.autorizacion_pdf!="" ? this.autorizacion_editar=false : this.autorizacion_editar=true;

        this.otros_antiguo=res.otros_pdf;
        res.otros_pdf!="" ? this.otros=URLIMAGENES.carpeta+'venta/'+res.otros_pdf : null;
        res.otros_pdf!="" ? this.otros_editar=false : this.otros_editar=true;

        if(res['garantes'].garantes.length>0){

          res['garantes'].garantes.forEach((item,index)=>{

            this.VentasSalidaForm['controls'].garantes['controls'][index].get('dni_pdf_antiguo').setValue(item.dni_pdf);
            this.VentasSalidaForm['controls'].garantes['controls'][index].get('cip_pdf_antiguo').setValue(item.cip_pdf);
            this.VentasSalidaForm['controls'].garantes['controls'][index].get('planilla_pdf_antiguo').setValue(item.planilla_pdf);
            this.VentasSalidaForm['controls'].garantes['controls'][index].get('letra_pdf_antiguo').setValue(item.letra_pdf);
            this.VentasSalidaForm['controls'].garantes['controls'][index].get('transaccion_pdf_antiguo').setValue(item.voucher_pdf);
            
            let dni_editar = item.dni_pdf == "" ? true : false;
            let cip_editar = item.cip_pdf == "" ? true : false;
            let planilla_editar = item.planilla_pdf == "" ? true : false;
            let letra_editar = item.letra_pdf == "" ? true : false;
            let transaccion_editar = item.voucher_pdf == "" ? true : false;

            this.VentasSalidaForm['controls'].garantes['controls'][index].get('dni_editar').setValue(dni_editar);
            this.VentasSalidaForm['controls'].garantes['controls'][index].get('cip_editar').setValue(cip_editar);
            this.VentasSalidaForm['controls'].garantes['controls'][index].get('planilla_editar').setValue(planilla_editar);
            this.VentasSalidaForm['controls'].garantes['controls'][index].get('letra_editar').setValue(letra_editar);
            this.VentasSalidaForm['controls'].garantes['controls'][index].get('transaccion_editar').setValue(transaccion_editar);

            let dni = item.dni_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.dni_pdf : null ;
            let cip = item.cip_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.cip_pdf : null ;
            let planilla = item.planilla_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.planilla_pdf : null ;
            let letra = item.letra_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.letra_pdf : null ;
            let voucher = item.voucher_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.voucher_pdf : null ;
  
            this.VentasSalidaForm['controls'].garantes['controls'][index].get('dni_pdf').setValue(dni);
            this.VentasSalidaForm['controls'].garantes['controls'][index].get('cip_pdf').setValue(cip);
            this.VentasSalidaForm['controls'].garantes['controls'][index].get('planilla_pdf').setValue(planilla);
            this.VentasSalidaForm['controls'].garantes['controls'][index].get('letra_pdf').setValue(letra);
            this.VentasSalidaForm['controls'].garantes['controls'][index].get('transaccion_pdf').setValue(voucher);

          })
        }

      }
      
      this.Cargando.next(false);
    })

  }

  CrearProducto(): FormGroup{
    return this.FormBuilder.group({
      'producto': [{value: null, disabled: false}, [
      ]],
      'producto_descripcion': [{value: null, disabled: false}, [
      ]],
      'id_serie': [{value: null, disabled: false}, [
      ]],
      'id_salida_producto': [{value: null, disabled: false}, [
      ]],
      'precio': [{value:null, disabled: false}, [
        Validators.required,
        Validators.min(1),
        Validators.pattern ('[0-9- ]+')
      ]],
      'estado': [{value:1, disabled: false}, [
      ]],
    })
  }

  AgregarProducto():void{
    this.productos = this.VentasSalidaForm.get('productos') as FormArray;
    this.productos.push(this.CrearProducto());
  };

  CrearGarante(bool): FormGroup{
    return this.FormBuilder.group({
      'id_cliente': [{value: null, disabled: false}, [
        Validators.required
      ]],
      'nombre': [{value: null, disabled: false}, [
        Validators.required
      ]],
      'direccion': [{value: null, disabled: false}, [
        Validators.required
      ]],
      'telefono': [{value: null, disabled: false}, [
        Validators.required
      ]],
      'dni_pdf': [{value: null, disabled: false}, [
      ]],
      'cip_pdf': [{value: null, disabled: false}, [
      ]],
      'planilla_pdf': [{value:null, disabled: false}, [
      ]],
      'letra_pdf': [{value: null, disabled: false}, [
      ]],
      'transaccion_pdf': [{value:null, disabled: false}, [
      ]],
      'dni_editar': [{value: bool, disabled: false}, [
      ]],
      'cip_editar': [{value: bool, disabled: false}, [
      ]],
      'planilla_editar': [{value:bool, disabled: false}, [
      ]],
      'letra_editar': [{value: bool, disabled: false}, [
      ]],
      'transaccion_editar': [{value:bool, disabled: false}, [
      ]],
      'dni_pdf_antiguo': [{value: null, disabled: false}, [
      ]],
      'cip_pdf_antiguo': [{value: null, disabled: false}, [
      ]],
      'planilla_pdf_antiguo': [{value:null, disabled: false}, [
      ]],
      'letra_pdf_antiguo': [{value: null, disabled: false}, [
      ]],
      'transaccion_pdf_antiguo': [{value:null, disabled: false}, [
      ]],
      'dni_pdf_nuevo': [{value: null, disabled: false}, [
      ]],
      'cip_pdf_nuevo': [{value: null, disabled: false}, [
      ]],
      'planilla_pdf_nuevo': [{value:null, disabled: false}, [
      ]],
      'letra_pdf_nuevo': [{value: null, disabled: false}, [
      ]],
      'transaccion_pdf_nuevo': [{value:null, disabled: false}, [
      ]],
      'estado': [{value:1, disabled: false}, [
      ]],
    })
  }

  AgregarGarante(bool):void{
    this.garantes = this.VentasSalidaForm.get('garantes') as FormArray;
    this.garantes.push(this.CrearGarante(bool));
    // this.VentasForm['controls'].garantes['controls'].forEach((item, index)=>{
    //   console.log(item.dni_editar)
    // })
  };

  SeleccionarCliente(){
    let Ventana = this.Dialogo.open(SeleccionarClienteComponent,{
      width: "1200px"
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        this.VentasSalidaForm.get('id_cliente').setValue(res.id);
        this.ObtenerClientexId(res.id);
        this.ObtenerDireccion(res.id);
        this.ObtenerTelefono(res.id);
      }
    })
  }

  ObtenerClientexId(id_cliente) {

    this.ClienteServicio.Seleccionar(id_cliente).subscribe(res => {
      if (res) {
        // console.log(res)
        this.VentasSalidaForm.get('cliente').setValue(res.nombre);
        this.VentasSalidaForm.get('dni').setValue(res.dni);
        this.VentasSalidaForm.get('cargo').setValue(res.cargo);
        this.VentasSalidaForm.get('trabajo').setValue(res.trabajo);
        this.Cargando.next(false);
      }
    });
  }

  ObtenerDireccion(id_cliente) {
    this.DireccionServicio.ListarDireccion( id_cliente, '1',1,20).subscribe(res => {
      if (res['data']) {
        this.VentasSalidaForm.get('direccion').setValue(res['data'].direcciones[0].direccioncompleta);
      }
    });
  }

  ObtenerTelefono(id_cliente) {
    this.TelefonoServicio.ListarTelefono( id_cliente , '1',1,20).subscribe(res => {
      if (res['data']) {
        this.VentasSalidaForm.get('telefono').setValue(res['data'].telefonos[0].tlf_numero);
      }
    });
  }

  RemoverCliente(){
    this.VentasSalidaForm.get('id_cliente').setValue(null);
    this.VentasSalidaForm.get('cliente').setValue(null);
    this.VentasSalidaForm.get('dni').setValue(null);
    this.VentasSalidaForm.get('cargo').setValue("");
    this.VentasSalidaForm.get('trabajo').setValue("");
    this.VentasSalidaForm.get('direccion').setValue("");
    this.VentasSalidaForm.get('telefono').setValue("");
  }

  EditarContactoCliente(){

    let id_cliente = this.VentasSalidaForm.value.id_cliente;

    let VentanaContacto = this.Dialogo.open(VentanaEmergenteContacto, {
      width: '1200px',
      data: id_cliente
    });

    VentanaContacto.afterClosed().subscribe(res=>{
      this.ObtenerDireccion(id_cliente);
      this.ObtenerTelefono(id_cliente);
    })
  }

  SeleccionarGarante(index){
    let Ventana = this.Dialogo.open(SeleccionarClienteComponent,{
      width: "1200px",
      data: {cliente : this.VentasSalidaForm.value.id_cliente}
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        this.VentasSalidaForm['controls'].garantes['controls'][index].get('id_cliente').setValue(res.id)
        this.VentasSalidaForm['controls'].garantes['controls'][index].get('nombre').setValue(res.nombre)
        this.ObtenerDireccionGarante(res.id,index);
        this.ObtenerTelefonoGarante(res.id,index);
      }
    })

  }

  ObtenerDireccionGarante(id_cliente, index) {
    this.DireccionServicio.ListarDireccion( id_cliente, '1',1,20).subscribe(res => {
      if (res['data']) {
        this.VentasSalidaForm['controls'].garantes['controls'][index].get('direccion').setValue(res['data'].direcciones[0].direccioncompleta)
      }
    });
  }

  ObtenerTelefonoGarante(id_cliente, index) {
    this.TelefonoServicio.ListarTelefono( id_cliente , '1',1,20).subscribe(res => {
      if (res['data']) {
        this.VentasSalidaForm['controls'].garantes['controls'][index].get('telefono').setValue(res['data'].telefonos[0].tlf_numero)
      }
    });
  }

  EliminarGarante(index){
    this.garantes.removeAt(index);
  }

  HayGarante(evento){
    if(evento.checked){
      if(this.id_venta_editar){
        this.AgregarGarante(true)
      }else{
        this.AgregarGarante(false)
      }
    }else{
      if(this.VentasSalidaForm['controls'].garantes['controls'].length>1){
        this.EliminarGarante(1);
        this.EliminarGarante(0);
      }else{
        this.EliminarGarante(0);
      }
      // this.VentasForm['controls'].garantes['controls'].forEach((item,index)=>{
      //   this.EliminarGarante(index)
      // })
    }
  }

  EditarContactoGarante(id_cliente, index){
    let VentanaContacto = this.Dialogo.open(VentanaEmergenteContacto, {
      width: '1200px',
      data: id_cliente
    });

    VentanaContacto.afterClosed().subscribe(res=>{
      this.ObtenerDireccionGarante(id_cliente,index);
      this.ObtenerTelefonoGarante(id_cliente,index);
    })
  }

  CrearCronograma(){

    this.Cronograma = [];

    let year = moment(this.VentasSalidaForm.value.fechapago).year();
    let month = moment(this.VentasSalidaForm.value.fechapago).month();
    let day = moment(this.VentasSalidaForm.value.fechapago).date();

    let fecha_corregida:Date = new Date(year, month, day);

    let fecha:Date;

    if (this.VentasSalidaForm.value.inicial>0) {
      this.Cronograma.push({
        numero:0,
        fecha_vencimiento: this.VentasSalidaForm.value.fechaventa,
        monto_cuota:this.VentasSalidaForm.value.inicial
      })
    }

    let monto=Math.round((this.VentasSalidaForm.value.montototal-this.FiltroInicial.nativeElement.value)*100/this.FiltroCuota.nativeElement.value)/100

    for (var i = 1; i<=this.FiltroCuota.nativeElement.value; i++) {

      fecha=moment(fecha_corregida).add(i-1, 'months').toDate();

      this.Cronograma.push({
        numero: i,
        fecha_vencimiento: fecha,
        monto_cuota: monto
      })

      this.ListadoVentas.Informacion.next(this.Cronograma);
    }

    this.CalcularTotalCronograma()

  }

  CalcularTotalCronograma(){
    this.total_cronograma_editado = 0;
    this.Cronograma.forEach((item)=>{
      this.total_cronograma_editado=this.total_cronograma_editado+item.monto_cuota*1;
    })
    this.diferencia= Math.abs(Math.round((this.VentasSalidaForm.value.montototal-this.total_cronograma_editado)*100)/100);
  }

  EditarCronograma(estado){
    this.editar_cronograma=estado;
    this.CalcularTotalCronograma();
  }

  // Cuando se cambia el orden del cronograma
  ActualizarOrdenCronograma(id, orden){
    this.Servicio.ListarCronograma(id, orden).subscribe(res=>{
      this.ListadoVentas.Informacion.next(res['data'].cronograma);
    })
  }

  SubirFoto(evento){
    if (!this.id_venta_editar) {
      this.foto=evento.serverResponse.response.body.data;
    }else{
      this.foto_nuevo=evento.serverResponse.response.body.data;
    }
  }

  SubirDNI(evento){
    if (!this.id_venta_editar) {
      this.dni=evento.serverResponse.response.body.data;
    }else{
      this.dni_nuevo=evento.serverResponse.response.body.data;
    }
  }

  SubirCIP(evento){
    if (!this.id_venta_editar) {
      this.cip=evento.serverResponse.response.body.data;
    }else{
      this.cip_nuevo=evento.serverResponse.response.body.data;
    }
  }

  SubirContrato(evento){
    if (!this.id_venta_editar) {
      this.contrato=evento.serverResponse.response.body.data;
    }else{
      this.contrato_nuevo=evento.serverResponse.response.body.data;
    }
  }

  SubirTransaccion(evento){
    if (!this.id_venta_editar) {
      this.transaccion=evento.serverResponse.response.body.data;
    }else{
      this.transaccion_nuevo=evento.serverResponse.response.body.data;
    }
  }

  SubirPlanilla(evento){
    if (!this.id_venta_editar) {
      this.planilla=evento.serverResponse.response.body.data;
    }else{
      this.planilla_nuevo=evento.serverResponse.response.body.data;
    }
  }

  SubirLetra(evento){
    if (!this.id_venta_editar) {
      this.letra=evento.serverResponse.response.body.data;
    }else{
      this.letra_nuevo=evento.serverResponse.response.body.data;
    }
  }

  SubirAutorizacion(evento){
    if (!this.id_venta_editar) {
      this.autorizacion=evento.serverResponse.response.body.data;
    }else{
      this.autorizacion_nuevo=evento.serverResponse.response.body.data;
    }
  }

  SubirOtros(evento){
    if (!this.id_venta_editar) {
      this.otros=evento.serverResponse.response.body.data;
    }else{
      this.otros_nuevo=evento.serverResponse.response.body.data;
    }
  }

  SubirDNIAval(evento, index){
    if (!this.id_venta_editar) {
      this.VentasSalidaForm['controls'].garantes['controls'][index].get('dni_pdf').setValue(evento.serverResponse.response.body.data);
    }else{
      this.VentasSalidaForm['controls'].garantes['controls'][index].get('dni_pdf_nuevo').setValue(evento.serverResponse.response.body.data);
    }
  }

  SubirCIPAval(evento, index){
    if (!this.id_venta_editar) {
      this.VentasSalidaForm['controls'].garantes['controls'][index].get('cip_pdf').setValue(evento.serverResponse.response.body.data);
    }else{
      this.VentasSalidaForm['controls'].garantes['controls'][index].get('cip_pdf_nuevo').setValue(evento.serverResponse.response.body.data);
    }
  }

  SubirPlanillaAval(evento, index){
    if (!this.id_venta_editar) {
      this.VentasSalidaForm['controls'].garantes['controls'][index].get('planilla_pdf').setValue(evento.serverResponse.response.body.data);
    }else{
      this.VentasSalidaForm['controls'].garantes['controls'][index].get('planilla_pdf_nuevo').setValue(evento.serverResponse.response.body.data);
    }
  }

  SubirLetraAval(evento, index){
    if (!this.id_venta_editar) {
      this.VentasSalidaForm['controls'].garantes['controls'][index].get('letra_pdf').setValue(evento.serverResponse.response.body.data);
    }else{
      this.VentasSalidaForm['controls'].garantes['controls'][index].get('letra_pdf_nuevo').setValue(evento.serverResponse.response.body.data);
    }
  }

  SubirTransaccionAval(evento, index){
    if (!this.id_venta_editar) {
      this.VentasSalidaForm['controls'].garantes['controls'][index].get('transaccion_pdf').setValue(evento.serverResponse.response.body.data);
    }else{
      this.VentasSalidaForm['controls'].garantes['controls'][index].get('transaccion_pdf_nuevo').setValue(evento.serverResponse.response.body.data);
    }
  }

  ListarTipoPago() {
    this.ServicioTipoPago.ListarTipoPago(2).subscribe( res => {
      this.ListadoTipoPago = res;
    });
  }

  TipoPagoSeleccionado(){
    if (this.VentasSalidaForm.value.tipopago==3 && !this.id_venta) {
      this.VentasSalidaForm.get('cuotas').setValue(1);
      this.VentasSalidaForm.get('cuotas').disable();
      this.VentasSalidaForm.get('inicial').setValue(0);
      this.VentasSalidaForm.get('inicial').disable();
    }else{
      this.VentasSalidaForm.get('cuotas').enable();
      this.VentasSalidaForm.get('inicial').enable();
    }
    this.CrearCronograma()
  }

  ListarProductos(){
    this.SServicio.ListarSalidaProductos(this.id_salida,1).subscribe(res=>{
      // console.log(res['data'].productos);
      this.ListadoProductos=res['data'].productos;
      this.ListadoProductosOriginal=res['data'].productos;
    })
  }

  ProductoSeleccionado(evento, index){
    this.VentasSalidaForm['controls'].productos['controls'][index].get('precio').setValue(evento.value.precio_minimo);
    this.VentasSalidaForm['controls'].productos['controls'][index].get('producto_descripcion').setValue(evento.value.producto+" ---> "+evento.value.serie);
    this.VentasSalidaForm['controls'].productos['controls'][index].get('id_serie').setValue(evento.value.id_serie);
    this.VentasSalidaForm['controls'].productos['controls'][index].get('id_salida_producto').setValue(evento.value.id);
    this.EliminarDuplicados();
    this.CalcularTotales();
  }

  EliminarDuplicados(){
    
    this.ListadoProductos = this.ListadoProductosOriginal;

    this.VentasSalidaForm['controls'].productos['controls'].forEach((item)=>{
      if(item.value.producto){
        this.ListadoProductos = this.ListadoProductos.filter(e => e.id != item.value.producto.id)
      }
    })
  }

  DesactivarProducto(producto){
    producto['eliminar'] = true;
    this.CalcularTotales();
  }

  ActivarProducto(producto){
    producto['eliminar'] = false;
    this.CalcularTotales();
  }
  
  EliminarProducto(index){
    this.productos.removeAt(index);
    this.CalcularTotales();
    this.EliminarDuplicados()
  }

  CalcularTotales(){
    
    let total_productos_antiguos: number = 0;
    let total_productos_nuevos: number = 0;

    this.Productos.forEach((item)=>{
      if(!item.eliminar){
        total_productos_antiguos = total_productos_antiguos + item.precio*1;
      }
    })

    this.VentasSalidaForm['controls'].productos['controls'].forEach((item)=>{
      // console.log(item);
      total_productos_nuevos = total_productos_nuevos + item.value.precio*1;
    })

    this.VentasSalidaForm.get('montototal').setValue(total_productos_antiguos+ total_productos_nuevos);

    this.CrearCronograma();

  }

  AbrirDocumento(url){
    if(url){
      window.open(url, "_blank");
    }
  }

  VerDetallePagos(cronograma){
    let Ventana = this.Dialogo.open(VentanaCronogramaComponent,{
      width: '900px',
      data: {numero: cronograma.numero, id:cronograma.id_cronograma}
    })
  }

  Atras(){
    this.location.back()
  }

  HayPapeles(evento){
    this.VentasSalidaForm.get('papeles').setValue(evento.checked)
  }

  SubirPapeles(evento){
    if(this.id_venta_editar){
      this.papeles_nuevo = evento.serverResponse.response.body.data;
    }else{
      this.papeles = evento.serverResponse.response.body.data;
    }
  }

  GuardarVenta(formulario){
    if(this.id_venta_editar){
      this.ActualizarVenta(formulario)
    }
  }

  ActualizarVenta(formulario){

    let random=(new Date()).getTime();

    return forkJoin(
      this.ServiciosGenerales.RenameFile(this.foto_nuevo,'DNI',random.toString(),"venta"),
      this.ServiciosGenerales.RenameFile(this.dni_nuevo,'DNI',random.toString(),"venta"),
      this.ServiciosGenerales.RenameFile(this.cip_nuevo,'CIP',random.toString(),"venta"),
      this.ServiciosGenerales.RenameFile(this.contrato_nuevo,'CONTRATO',random.toString(),"venta"),
      this.ServiciosGenerales.RenameFile(this.transaccion_nuevo,'TRANSACCION',random.toString(),"venta"),
      this.ServiciosGenerales.RenameFile(this.planilla_nuevo,'PLANILLA',random.toString(),"venta"),
      this.ServiciosGenerales.RenameFile(this.letra_nuevo,'LETRA',random.toString(),"venta"),
      this.ServiciosGenerales.RenameFile(this.autorizacion_nuevo,'AUTORIZACION',random.toString(),"venta"),
      this.ServiciosGenerales.RenameFile(this.otros_nuevo,'AUTORIZACION',random.toString(),"venta"),
      this.ServiciosGenerales.RenameFile(this.papeles_nuevo,'PAPELES',random.toString(),"venta"),
    ).subscribe(resultado=>{

      // Cuando se actualiza la venta, en el procedimiento
      // se eliminan el cronograma actual y los garantes

      this.Servicio.ActualizarVenta(
        this.id_venta_editar,
        formulario.value.fechaventa,
        0,
        formulario.value.id_contrato,
        0,
        formulario.value.id_cliente,
        formulario.value.direccion,
        formulario.value.telefono,
        formulario.value.cargo,
        formulario.value.trabajo,
        formulario.value.lugar,
        0,
        2,
        formulario.value.id_salida, // Porque no pertenece a ninguna salida de ventas
        formulario.value.tipopago,
        formulario.value.tipopago==3 ? 0 : formulario.value.inicial,
        formulario.value.tipopago==3 ? 1 :formulario.value.cuotas,
        formulario.value.montototal,
        formulario.value.fechapago,
        this.foto_editar ? resultado[0].mensaje : this.foto_antiguo,
        this.dni_editar ? resultado[1].mensaje : this.dni_antiguo,
        this.cip_editar ? resultado[2].mensaje : this.cip_antiguo,
        this.contrato_editar ? resultado[3].mensaje : this.contrato_antiguo,
        this.transaccion_editar ? resultado[4].mensaje : this.transaccion_antiguo,
        this.planilla_editar ? resultado[5].mensaje : this.planilla_antiguo,
        this.letra_editar ? resultado[6].mensaje : this.letra_antiguo,
        this.autorizacion_editar ? resultado[7].mensaje : this.autorizacion_antiguo,
        this.otros_editar ? resultado[8].mensaje : this.otros_antiguo,
        formulario.value.observaciones
      ).subscribe(res=>{

        // Productos antiguos
        this.Productos.forEach((item)=>{
          // console.log(item)
          if(!item.eliminar){
            this.Servicio.ActualizarProductoSalida(this.id_venta_editar, item.id_serie, item.precio).subscribe()
          }
          // Si se tienen que eliminar, se elimina
          if(item.eliminar){
            this.Servicio.EliminarProductosSalidaVenta(formulario.value.id_salida, item.id, item.id_serie).subscribe()
          }
        })

        // Se actualizan los datos del courier
        if( this.VentasSalidaForm.value.papeles ){
          this.SgServicio.Actualizar(
            this.VentasSalidaForm.value.papeles_id,
            this.VentasSalidaForm.value.papeles_courier,
            this.VentasSalidaForm.value.papeles_fecha_envio,
            this.VentasSalidaForm.value.papeles_seguimiento,
            this.papeles_editar ? resultado[9].mensaje : this.papeles_antiguo,
            this.VentasSalidaForm.value.papeles_observaciones
          ).subscribe();
        }

        // Productos nuevos que se van a agregar
        formulario.value.productos.forEach((item)=>{
          this.SServicio.ActualizarSalidaProductos(item.id_salida_producto, this.id_venta_editar, item.precio).subscribe(res=>console.log(res));
        })

        // Se genera el cronograma
        this.Cronograma.forEach((item)=>{
          if(item.numero==0){
            this.Servicio.CrearVentaCronograma(res['data'],formulario.value.tipopago,item.monto_cuota,item.fecha_vencimiento,1).subscribe()
          }else{
            this.Servicio.CrearVentaCronograma(res['data'],formulario.value.tipopago,item.monto_cuota,item.fecha_vencimiento,1).subscribe()
          }
        });
        
        // Si la venta tiene garante, se los agrega
        if( this.VentasSalidaForm.value.garante ){

          this.VentasSalidaForm['controls'].garantes['controls'].forEach((item, index)=>{
            return forkJoin(
              this.ServiciosGenerales.RenameFile(item.value.dni_pdf_nuevo,'DNI_GARANTE_'+(index+1),random.toString(),"venta"),
              this.ServiciosGenerales.RenameFile(item.value.cip_pdf_nuevo,'CIP_GARANTE_'+(index+1),random.toString(),"venta"),
              this.ServiciosGenerales.RenameFile(item.value.planilla_pdf_nuevo,'PLANILLA_GARANTE_'+(index+1),random.toString(),"venta"),
              this.ServiciosGenerales.RenameFile(item.value.letra_pdf_nuevo,'LETRA_GARANTE_'+(index+1),random.toString(),"venta"),
              this.ServiciosGenerales.RenameFile(item.value.transaccion_pdf_nuevo,'TRANSACCION_GARANTE_'+(index+1),random.toString(),"venta"),
            ).subscribe(response=>{
              this.Servicio.CrearVentaGarante(
                res['data'],
                item.value.id_cliente,
                item.value.direccion,
                item.value.telefono,
                item.value.dni_editar ? response[0].mensaje : item.value.dni_pdf_antiguo,
                item.value.cip_editar ? response[1].mensaje : item.value.cip_pdf_antiguo,
                item.value.planilla_editar ? response[2].mensaje : item.value.planilla_pdf_antiguo,
                item.value.letra_editar ? response[3].mensaje : item.value.letra_pdf_antiguo,
                item.value.transaccion_editar ? response[4].mensaje : item.value.transaccion_pdf_antiguo
              ).subscribe()
            })
          })

        }

        setTimeout(()=>{
          this.Atras();
  
          if(res['codigo']==0){
            this.Notificacion.Snack("Se editó la venta con éxito!","");
          }else{
            this.Notificacion.Snack("Ocurrió un error al editar la venta","");
          }
        }, 300)

      })
    })
  }

  RegistrarPago(cronograma){
    let Ventana = this.Dialogo.open(VentanaCrearCobranzaManualComponent,{
      data : { cliente : this.VentasSalidaForm.get('id_cliente').value, pendiente : cronograma.monto_pendiente, cronograma : cronograma.id_cronograma, tipo : 2 } ,
      width : '1200px' ,
      maxHeight : '80vh'
    }) ;

    Ventana.afterClosed().subscribe(res=>{
      if(res) {
        this.Notificacion.Snack("Se registró el pago satisfactoriamente", "") ;
        this.ActualizarOrdenCronograma(this.id_venta, "fecha_vencimiento asc") ;
      }
      if(res===false) {
        this.Notificacion.Snack("Ocurrió un error al registrar el pago", "") ;
      }
    })
  }

}

export class VentaDataSource implements DataSource<any>{

  public Informacion = new BehaviorSubject<any>([])

  constructor(
    private Servicio: VentaService
  ){ }

  connect(collectionViewer: CollectionViewer){
    return this.Informacion.asObservable()
  }

  disconnect(){
    this.Informacion.complete()
  }

  CargarInformacion(id_venta, orden){
    this.Servicio.ListarCronograma(id_venta, orden).subscribe(res=>{
      this.Informacion.next(res['data'].cronograma);
    })
  }

}

