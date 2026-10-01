import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablitaComponent } from './tablita.component';

describe('TablitaComponent', () => {
  let component: TablitaComponent;
  let fixture: ComponentFixture<TablitaComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TablitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
