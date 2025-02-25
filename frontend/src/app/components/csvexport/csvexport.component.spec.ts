import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvexportComponent } from './csvexport.component';

describe('CsvexportComponent', () => {
  let component: CsvexportComponent;
  let fixture: ComponentFixture<CsvexportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CsvexportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsvexportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
