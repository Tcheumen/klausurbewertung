import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Threshold } from '../../models/threshold';

@Component({
  selector: 'app-thresholds',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './thresholds.component.html',
  styleUrls: ['./thresholds.component.scss']
})
export class ThresholdsComponent implements OnInit {

  thresholds: Threshold[] = [];
  newThreshold: Threshold = { points: 0, percentage: 0, note: 0 };
  loading: boolean = false;
  errorMessage: string | null = null;
  saveMessage: string = '';

  isSaved = false;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.loadThresholds();
  }

  // Bestehende Schwellenwerte laden
  loadThresholds(): void {
    this.loading = true;
    this.apiService.getThresholds().subscribe({
      next: (response) => {
        this.thresholds = response.thresholds.sort((a, b) => a.percentage - b.percentage);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Fehler beim Laden der Schwellenwerte.';
        this.loading = false;
      }
    });
  }

  // Einen neuen Schwellenwert hinzufügen
  addThreshold(): void {
    this.apiService.addThreshold(this.newThreshold).subscribe({
      next: (response) => {
        this.thresholds = response.thresholds;
        this.newThreshold = { points: 0, percentage: 0, note: 0 }; // Formular zurücksetzen
      },
      error: () => {
        this.errorMessage = 'Fehler beim Hinzufügen des Schwellenwerts oder dieser Schwellenwert existiert bereits.';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  // Einen Schwellenwert löschen
  deleteThreshold(percentage: number): void {
    this.apiService.deleteThreshold(percentage).subscribe({
      next: (response) => {
        this.thresholds = response.thresholds;
      },
      error: () => {
        this.errorMessage = 'Fehler beim Löschen des Schwellenwerts.';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  // Alle geänderten Schwellenwerte speichern
  saveAllThresholds(): void {
    this.thresholds.sort((a, b) => a.percentage - b.percentage);

    this.apiService.saveThresholds(this.thresholds).subscribe({
      next: (response) => {
        console.log('Schwellenwerte erfolgreich gespeichert:', response);
        this.thresholds = response.thresholds;
        this.saveMessage = 'Schwellenwerte erfolgreich gespeichert';
        this.isSaved = true;
        setTimeout(() => this.saveMessage = '', 3000);
       
      },
      error: (error) => {
        console.error('Fehler beim Speichern:', error);
        this.errorMessage = 'Fehler beim Speichern der Schwellenwerte.';
        setTimeout(() => this.errorMessage= '', 3000);
      }
    });
  }

  navigateToNext(): void {
    this.router.navigate(['/upload']);
  }

  navigateToPrevious(): void {
    this.router.navigate(['/module']);
  }

}
