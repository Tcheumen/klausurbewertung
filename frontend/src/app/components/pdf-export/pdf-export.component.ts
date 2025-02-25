import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-pdf-export',
  imports: [CommonModule, FormsModule],
  templateUrl: './pdf-export.component.html',
  styleUrls: ['./pdf-export.component.scss']
})
export class PdfExportComponent {

  @Input() disabled: boolean = false;
  @Output() exportPdfClicked = new EventEmitter<void>();

  constructor(private apiService: ApiService) { }

  downloadPDF() {
    this.apiService.exportPDF().subscribe((response: Blob) => {
      const fileURL = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = 'Pruefungsbewertungsbericht.pdf';
      link.click();
    }, error => {
      console.error("Erreur lors du téléchargement du PDF:", error);
    });
  }

  onPdfButtonClick(): void{
    this.exportPdfClicked.emit();
  }
}
