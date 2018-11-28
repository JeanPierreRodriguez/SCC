import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from '../global/url';
import * as moment from 'moment';

@Injectable()

export class  HistorialMovimientosService {
  public url: string = URL.url;

  constructor(private http: HttpClient) {}

  ListarMovimientos(
    almacen:string,
    tipo:number,
    estado_transaccion:number,
    referente:string,
    fecha_inicio: Date,
    fecha_fin: Date,
    documento:string,
    pagina_inicio: number,
    total_pagina: number,
    orden:string,
  ): Observable<any> {

    // let parametro_corregido;

    // if (estado_transaccion == 0) {
    //   parametro_corregido=null
    // }else{
    //   parametro_corregido=estado_transaccion.toString()
    // }

    return this.http.get(this.url + 'transaccioncabecera/read.php', {
      params: new HttpParams()
        .set('pralmacen', almacen)
        .set('prtipo', tipo.toString())
        .set('prparametro',estado_transaccion.toString())
        .set('prreferente', referente)
        .set('prfechainicio', moment(fecha_inicio).format("YYYY/MM/DD"))
        .set('prfechafin', moment(fecha_fin).format("YYYY/MM/DD"))
        .set('prdocumento', documento)
        .set('prpagina', pagina_inicio.toString())
        .set('prtotalpagina', total_pagina.toString())
        .set('orden', orden)
      }).pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos para mostrar');
        return res;
    }
    }));
  }
}
