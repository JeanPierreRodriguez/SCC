import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CobranzaJudicialComponent } from './cobranza-judicial.component';

describe('CobranzaJudicialComponent', () => {
  let component: CobranzaJudicialComponent;
  let fixture: ComponentFixture<CobranzaJudicialComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaJudicialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaJudicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
