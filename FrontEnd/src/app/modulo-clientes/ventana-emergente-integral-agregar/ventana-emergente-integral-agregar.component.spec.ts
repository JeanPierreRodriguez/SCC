import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaEmergenteIntegralAgregarComponent } from './ventana-emergente-integral-agregar.component';

describe('VentanaEmergenteIntegralAgregarComponent', () => {
  let component: VentanaEmergenteIntegralAgregarComponent;
  let fixture: ComponentFixture<VentanaEmergenteIntegralAgregarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaEmergenteIntegralAgregarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaEmergenteIntegralAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
