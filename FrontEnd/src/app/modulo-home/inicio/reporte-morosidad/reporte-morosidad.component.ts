import { Component, OnInit, ViewChild } from '@angular/core';

import {
  IBarChartOptions,
  IChartistAnimationOptions,
  IChartistData,
  IChartistBarChart,
} from 'chartist';
import { ChartEvent, ChartType } from 'ng-chartist';
import { CobranzasService } from 'src/app/modulo-cobranzas/cobranzas-listar/cobranzas.service';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { VentanaAuxiliarProvisionalComponent } from '../../../modulo-reportes/ventana-auxiliar-provisional/ventana-auxiliar-provisional.component';

@Component({
  selector: 'app-reporte-morosidad',
  templateUrl: './reporte-morosidad.component.html',
  styleUrls: ['./reporte-morosidad.component.css']
})
export class ReporteMorosidadComponent implements OnInit {

  @ViewChild('Grafico', { static: true }) private chart: IChartistBarChart;

  public type: ChartType = 'Bar';
  public data = new BehaviorSubject<IChartistData>({labels: ['Morosos','Muy morosos'],series: [[0,0]]});

  public options: IBarChartOptions = {
    axisX: {
      showGrid: false
    },
    height: 300,
  };
 
  public events: ChartEvent = {
    draw: (data) => {
      if (data.type === 'bar') {
        data.element.animate({
          y2: <IChartistAnimationOptions>{
            dur: '0.5s',
            from: data.y1,
            to: data.y2,
            easing: 'easeOutQuad'
          }
        });
      }
    },
  };

  constructor(
    private _cobranzas : CobranzasService ,
    private _dialogo : MatDialog ,
  ) { }

  ngOnInit() {
    this.ObtenerInformacion();
  }

  ObtenerInformacion(){
    this._cobranzas.ListarCobranzasxclienteMorosos("","","","",0,null,new Date()).subscribe(res=>{
      if(res) {
        let morosos1 = res['data'].morosos ;
        let morosos2 = res['data'].muy_morosos ;
        let informacion = { labels:["Morosos", "Muy morosos"], series: [[morosos1,morosos2]], click: this.VerDetalle }
        this.ActualizarInformacion(informacion) ;
      }
    })
  }

  ActualizarInformacion(informacion){
    this.data.next(informacion);
  }

  VerDetalle($evento) {
    this._dialogo.open(VentanaAuxiliarProvisionalComponent, {
      width: '90%' ,
      maxHeight : '80vh'
    })
  }

}
