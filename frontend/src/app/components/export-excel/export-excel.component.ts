import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Exercice } from '../../models/exercice';

@Component({
  selector: 'app-export-excel',
  imports: [CommonModule, FormsModule],
  templateUrl: './export-excel.component.html',
  styleUrls: ['./export-excel.component.scss']
})
export class ExportEXcelComponent {

  @Input() disabled: boolean = false;
  @Output() exportClicked = new EventEmitter<void>();

  constructor(private apiService: ApiService) { }
  
  // fichier excel
  downloadExcelData(): void {
    this.apiService.exportExcelData().subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Bewertungsdaten1.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  onButtonClick(): void {
    this.exportClicked.emit();
  }

}
