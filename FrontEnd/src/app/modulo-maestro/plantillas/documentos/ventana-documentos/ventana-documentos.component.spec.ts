import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaDocumentosComponent } from './ventana-documentos.component';

describe('VentanaDocumentosComponent', () => {
  let component: VentanaDocumentosComponent;
  let fixture: ComponentFixture<VentanaDocumentosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaDocumentosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
