import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ordercart } from './ordercart';

describe('Ordercart', () => {
  let component: Ordercart;
  let fixture: ComponentFixture<Ordercart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ordercart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ordercart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
