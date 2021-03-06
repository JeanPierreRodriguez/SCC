import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CobranzaJudicialService } from '../cobranza-judicial.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ServiciosVentas } from 'src/app/core/servicios/ventas';
import { ServiciosGenerales } from 'src/app/core/servicios/servicios';
import { ProcesoJudicialVinculadosService } from '../../../modulo-maestro/proceso-judicial-vinculados/proceso-judicial-vinculados.service';
import { URLIMAGENES } from 'src/app/core/servicios/url';

@Component({
  selector: 'app-ventana-judicial',
  templateUrl: './ventana-judicial.component.html',
  styleUrls: ['./ventana-judicial.component.scss'],
  providers: [ServiciosVentas]
})
export class VentanaJudicialComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;
  public archivo : File ;
  public archivo_nombre : string = "";
  public archivo_nombre_antiguo : string = "";
  public archivo_nombre_antiguo_enlace : string = "";
  public VentanaJudicialForm : FormGroup ;
  public TipoDocumentos : Array<any> ;
  public Trabajadores : Array<any> ;
  public Estados : Array<any> ;
  public ver : boolean = false ;
  public editar : boolean = false ;
  public editar_archivo : boolean = false ;
  public primer_documento : boolean ;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private ventana : MatDialogRef<VentanaJudicialComponent> ,
    private Builder : FormBuilder ,
    private _judiciales : CobranzaJudicialService ,
    private _vinculados : ProcesoJudicialVinculadosService ,
    private _ventas: ServiciosVentas,
    private _generales : ServiciosGenerales
  ) { }

  ngOnInit() {
    this.CrearFormulario();
    this.ListarTipoDocumentos();
    this.ListarTrabajadores();

    if  (this.data.ver_proceso_detalle) {
      this.ver = true ;
      this.SeleccionarProceso(this.data.ver_proceso_detalle) ;
    } else {
      this.VerificarDocumentos();
        if(this.data.proceso_detalle){
        this.editar = true ;
        this.EditarProceso();
      } else {
        this.VentanaJudicialForm.get('tipo_documento').setValue(this.data.tipo_documento) ;
        this.TipoDocumentoSeleccionado( this.data.tipo_documento ) ;
      }
    }
  }

  CrearFormulario(){
    this.VentanaJudicialForm = this.Builder.group({
      id_proceso : [ { value: 0, disabled : false },[
      ] ],
      tipo_documento : [ { value: null, disabled : false },[
        Validators.required ,
      ] ],
      tipo_documento_nombre : [ { value: "", disabled : false },[
      ] ],
      fecha : [ { value: null, disabled : false }, [
        Validators.required ,
      ] ],
      estado : [ { value: 0, disabled : false }, [
      ] ],
      numero_resolucion : [ { value: "", disabled : false }, [
        Validators.required ,
        Validators.min(1)
      ] ],
      sumilla : [ { value: "", disabled : false }, [
      ] ],
      trabajador : [ { value: "", disabled : false }, [
      ] ],
      comentarios : [ { value: "", disabled : false }, [
      ] ],
      fecha_notificacion_demandado : [ { value: null, disabled : false }, [
      ] ],
      fecha_notificacion_cooperativa : [ { value: null, disabled : false }, [
      ] ],
      fecha_notificacion_retorno : [ { value: null, disabled : false }, [
      ] ],
    })
  }

  VerificarDocumentos(){
    forkJoin([
      this._judiciales.ListarDetallexProceso( this.data.proceso ) ,
      this._judiciales.ListarDetalleAnteriorxProceso( this.data.proceso )
    ]).subscribe(res=>{
      if( res[0] || res[1] ) {
      } else {
        this.primer_documento = true ;
        this.VentanaJudicialForm.get('fecha').setValue(this.data.fecha) ;
      }
    })
  }

  ListarTipoDocumentos(){
    this._vinculados.ListarDocumentosJudiciales("",1,50).subscribe(res=>{
      this.TipoDocumentos = res['data'].documentos ;
      this.ObtenerNombreDocumentoJudicial() ;
    })
  }

  ListarEstados(){
    this._vinculados.ListarEstado(this.VentanaJudicialForm.value.tipo_documento,"","",1,50).subscribe(res=>{
      this.Estados = res['data'].estados ;
    })
  }

  ListarTrabajadores(){
    this._ventas.ListarVendedores("","","",0,1,50).subscribe(res=>{
      this.Trabajadores = res['data'].vendedores
    })
  }

  EditarProceso(){
    this.VentanaJudicialForm.get('id_proceso').setValue(this.data.proceso_detalle.id) ;
    this.VentanaJudicialForm.get('tipo_documento').setValue(this.data.proceso_detalle.id_tipo_documento) ;
    this.VentanaJudicialForm.get('tipo_documento_nombre').setValue(this.data.proceso_detalle.tipo_documento) ;
    this.VentanaJudicialForm.get('fecha').setValue(this.data.proceso_detalle.fecha) ;
    this.VentanaJudicialForm.get('numero_resolucion').setValue(this.data.proceso_detalle.numero) ;
    this.VentanaJudicialForm.get('sumilla').setValue(this.data.proceso_detalle.sumilla) ;
    this.VentanaJudicialForm.get('comentarios').setValue(this.data.proceso_detalle.comentarios) ;
    this.VentanaJudicialForm.get('trabajador').setValue(this.data.proceso_detalle.id_trabajador) ;
    this.VentanaJudicialForm.get('estado').setValue(this.data.proceso_detalle.id_estado) ;

    this.VentanaJudicialForm.get('fecha_notificacion_demandado').setValue(this.data.proceso_detalle.fecha_notificacion_demandado) ;
    this.VentanaJudicialForm.get('fecha_notificacion_cooperativa').setValue(this.data.proceso_detalle.fecha_notificacion_cooperativa) ;
    this.VentanaJudicialForm.get('fecha_notificacion_retorno').setValue(this.data.proceso_detalle.fecha_notificacion_retorno) ;

    this.ListarEstados() ;
    if( this.VentanaJudicialForm.value.tipo_documento == 2 ) {
      this.VentanaJudicialForm.get('trabajador').enable();
      this.VentanaJudicialForm.get('trabajador').setValidators([Validators.required]) ;
    } else {
      this.VentanaJudicialForm.get('trabajador').setValue(0)
      this.VentanaJudicialForm.get('trabajador').disable();
      this.VentanaJudicialForm.get('trabajador').setValidators([]) ;
    }

    this.archivo_nombre_antiguo = this.data.proceso_detalle.archivo_antiguo ;
    this.archivo_nombre_antiguo_enlace = this.data.proceso_detalle.archivo ;
    this.editar_archivo = this.data.proceso_detalle.archivo_antiguo ? false : true ;
  }

  SeleccionarProceso(id_proceso){
    this.Cargando.next(true) ;

    this._judiciales.ListarDetallexProcesoxId(id_proceso)
    .pipe(
      finalize(()=> {
        this.Cargando.next(false) ;
      })
    )
    .subscribe(resultado => {
      if (resultado) {
        this.VentanaJudicialForm.get('id_proceso').setValue(resultado.id) ;
        this.VentanaJudicialForm.get('tipo_documento').setValue(resultado.id_tipo_documento) ;
        this.VentanaJudicialForm.get('tipo_documento_nombre').setValue(resultado.tipo_documento) ;
        this.VentanaJudicialForm.get('fecha').setValue(resultado.fecha) ;
        this.VentanaJudicialForm.get('numero_resolucion').setValue(resultado.numero) ;
        this.VentanaJudicialForm.get('sumilla').setValue(resultado.sumilla) ;
        this.VentanaJudicialForm.get('comentarios').setValue(resultado.comentarios) ;
        this.VentanaJudicialForm.get('trabajador').setValue(resultado.trabajador) ;
        this.VentanaJudicialForm.get('estado').setValue(resultado.estado) ;

        this.archivo_nombre_antiguo_enlace = URLIMAGENES.carpeta + 'proceso judicial/' + resultado.archivo ;
      }
    })
  }

  SubirArchivo(archivo: FileList) {
    this.archivo = archivo.item(0);
    this.archivo_nombre = this.archivo.name ;
  }

  RemoverArchivo(){
    this.archivo = null ;
    this.archivo_nombre = "" ;
  }

  TipoDocumentoSeleccionado( tipo : number ){
    this.VentanaJudicialForm.get('tipo_documento').setValue(tipo)

    this.ObtenerNombreDocumentoJudicial() ;
    this.ObtenerNumeroDocumento() ;
    this.ListarEstados() ;
    // if( this.VentanaJudicialForm.value.tipo_documento == 2 ) {
    //   this.VentanaJudicialForm.get('trabajador').enable();
    //   this.VentanaJudicialForm.get('trabajador').setValidators([Validators.required]) ;
    // } else {
    //   this.VentanaJudicialForm.get('trabajador').setValue(0)
    //   this.VentanaJudicialForm.get('trabajador').disable();
    //   this.VentanaJudicialForm.get('trabajador').setValidators([]) ;
    // }
  }

  ObtenerNombreDocumentoJudicial() {
    if ( this.TipoDocumentos && this.VentanaJudicialForm.get('tipo_documento').value ) {
      let tipo_documento_nombre : string ;
      tipo_documento_nombre = this.TipoDocumentos.filter( e => e.id == this.VentanaJudicialForm.get('tipo_documento').value )[0].nombre ;
      this.VentanaJudicialForm.get('tipo_documento_nombre').setValue(tipo_documento_nombre)
    }
  }

  ObtenerNumeroDocumento(){
    this._judiciales.ObtenerProximoNumero(
      this.data.proceso,
      this.VentanaJudicialForm.value.tipo_documento,
      this.VentanaJudicialForm.value.id_proceso
    ).subscribe(res=>{
      this.VentanaJudicialForm.get('numero_resolucion').setValue(res) ;
    })
  }

  AbrirDocumento(archivo){
    if(archivo){
      window.open(archivo, "_blank");
    }
  }

  Guardar(){
    let random=(new Date()).getTime() ;

    let documento = this.TipoDocumentos.filter(e=>e.id=this.VentanaJudicialForm.value.tipo_documento)[0].nombre.toLowerCase() ;

    this.Cargando.next(true);
    if( !this.editar ) {
      this._generales.SubirArchivo(this.archivo).subscribe(path_archivo=>{
        this._generales.RenameFile(path_archivo['data'], documento, "_" + random, "proceso judicial")
        .subscribe(archivo_nombre=>{
          this._judiciales.CrearProcesoDetalle(
            this.data.proceso ,
            this.VentanaJudicialForm.value.tipo_documento ,
            this.VentanaJudicialForm.value.fecha ,
            this.VentanaJudicialForm.value.trabajador || 0 ,
            this.VentanaJudicialForm.value.estado || 0 ,
            this.VentanaJudicialForm.value.numero_resolucion ,
            this.VentanaJudicialForm.value.sumilla ,
            archivo_nombre.mensaje ,
            this.VentanaJudicialForm.value.comentarios ,
            this.VentanaJudicialForm.value.tipo_documento == 8 ? this.VentanaJudicialForm.get('fecha_notificacion_demandado').value : null ,
            this.VentanaJudicialForm.value.tipo_documento == 8 ? this.VentanaJudicialForm.get('fecha_notificacion_cooperativa').value : null ,
            this.VentanaJudicialForm.value.tipo_documento == 8 ? this.VentanaJudicialForm.get('fecha_notificacion_retorno').value : null ,
          )
          .pipe(
            finalize(()=>this.Cargando.next(false))
          )
          .subscribe(res=>{
            this.ventana.close( { resultado: res } );
          })
        })
      })
    }

    if( this.editar ) {
      if( this.archivo ) {
        this._generales.SubirArchivo(this.archivo).subscribe(path_archivo=>{
          this._generales.RenameFile(path_archivo['data'], documento, "_" + random, "proceso judicial")
          .subscribe(archivo_nombre=>{
            this._judiciales.ActualizarProcesoDetalle(
              this.VentanaJudicialForm.value.id_proceso,
              this.VentanaJudicialForm.value.tipo_documento,
              this.VentanaJudicialForm.value.fecha,
              this.VentanaJudicialForm.value.trabajador || 0,
              this.VentanaJudicialForm.value.estado || 0,
              this.VentanaJudicialForm.value.numero_resolucion,
              this.VentanaJudicialForm.value.sumilla,
              archivo_nombre.mensaje,
              this.VentanaJudicialForm.value.comentarios ,
              this.VentanaJudicialForm.value.tipo_documento == 8 ? this.VentanaJudicialForm.get('fecha_notificacion_demandado').value : null ,
              this.VentanaJudicialForm.value.tipo_documento == 8 ? this.VentanaJudicialForm.get('fecha_notificacion_cooperativa').value : null ,
              this.VentanaJudicialForm.value.tipo_documento == 8 ? this.VentanaJudicialForm.get('fecha_notificacion_retorno').value : null ,
            )
            .pipe(
              finalize(()=>this.Cargando.next(false))
            )
            .subscribe(res=>{
              this.ventana.close( { resultado: res } );
            })
          })
        })
      } else {
        this._judiciales.ActualizarProcesoDetalle(
          this.VentanaJudicialForm.value.id_proceso,
          this.VentanaJudicialForm.value.tipo_documento,
          this.VentanaJudicialForm.value.fecha,
          this.VentanaJudicialForm.value.trabajador || 0,
          this.VentanaJudicialForm.value.estado || 0,
          this.VentanaJudicialForm.value.numero_resolucion,
          this.VentanaJudicialForm.value.sumilla,
          this.archivo_nombre_antiguo,
          this.VentanaJudicialForm.value.comentarios ,
          this.VentanaJudicialForm.value.tipo_documento == 8 ? this.VentanaJudicialForm.get('fecha_notificacion_demandado').value : null ,
          this.VentanaJudicialForm.value.tipo_documento == 8 ? this.VentanaJudicialForm.get('fecha_notificacion_cooperativa').value : null ,
          this.VentanaJudicialForm.value.tipo_documento == 8 ? this.VentanaJudicialForm.get('fecha_notificacion_retorno').value : null ,
        )
        .pipe(
          finalize(()=>this.Cargando.next(false))
        )
        .subscribe(res=>{
          this.ventana.close( { resultado: res } );
        })
      }
    }
  }
}
