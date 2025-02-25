import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportEXcelComponent } from './export-excel.component';

describe('ExportEXcelComponent', () => {
  let component: ExportEXcelComponent;
  let fixture: ComponentFixture<ExportEXcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportEXcelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportEXcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
