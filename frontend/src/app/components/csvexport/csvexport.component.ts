import { Component, Input, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-csvexport',
  imports: [CommonModule, FormsModule],
  templateUrl: './csvexport.component.html',
  styleUrls: ['../../../assets/css/styles.css']
})
export class CsvexportComponent {

  saveMessage: string = '';
  @Input() disabled: boolean = false;
  @Output() exportCsvClicked = new EventEmitter<void>();

  constructor(private apiService: ApiService) { }
  
  downloadCsvData(): void {
    this.apiService.exportExamDataCSV().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'exam_data.csv';
        a.click();
      },
      error: () => {
        this.saveMessage = 'Erreur lors de l’exportation du fichier CSV.';
      }
    });
  }

  onButtonCsvClicked(): void {
    this.exportCsvClicked.emit();
  }
}
