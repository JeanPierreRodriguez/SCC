import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaCooperativaDireccionesComponent } from './ventana-cooperativa-direcciones.component';

describe('VentanaCooperativaDireccionesComponent', () => {
  let component: VentanaCooperativaDireccionesComponent;
  let fixture: ComponentFixture<VentanaCooperativaDireccionesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaCooperativaDireccionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaCooperativaDireccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
