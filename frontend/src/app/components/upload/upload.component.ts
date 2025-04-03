import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Student } from '../../models/student';
import { Threshold } from '../../models/threshold';
import { getBewertung, getNote } from '../../utils/calculations';
import { ExportEXcelComponent } from '../export-excel/export-excel.component';
import { PdfExportComponent } from '../pdf-export/pdf-export.component';
import { CsvexportComponent } from '../csvexport/csvexport.component';
declare const window: any;


@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, ExportEXcelComponent, PdfExportComponent, CsvexportComponent],
  templateUrl: './upload.component.html',
  styleUrls: ['../../../assets/css/styles.css']
})
export class UploadComponent implements OnInit {

  @ViewChild(ExportEXcelComponent) exportExcelComp!: ExportEXcelComponent;
  @ViewChild(PdfExportComponent) exportPdfComp!: PdfExportComponent;
  @ViewChild(CsvexportComponent) exportCsvComp!: CsvexportComponent;
  @Input() students: Student[] = [];
  @Input() tasks: string[] = [];

  thresholds: Threshold[] = [];
  taskWeights: { [task: string]: number } = {};
  

  newTask: string = '';
  newTaskWeight: number = 0;
  fileError: string = '';
  saveMessage: string = '';
  taskMessage: string = '';
  taskError: string = '';
  isSaved: boolean = false;
  isFileUploaded: boolean = false;


  scoreErrors: { [studentId: string]: { [task: string]: string } } = {};

  file: File | null = null;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.loadThresholds();
    
    if (typeof window !== 'undefined' && window.electron) {  
      console.log("Electron détecté, chargement des données depuis electron-store...");

      window.electron.loadData().then((data: any) => {
        this.students = data.students || [];
        this.taskWeights = data.taskWeights || {};

        if (this.students.length > 0 && this.students[0].scores) {
          this.tasks = Object.keys(this.students[0].scores);
        }

        this.isFileUploaded = this.students.length > 0;
      });
    } 
  }



  //  Bewertungsgrenzen aus der API laden
  loadThresholds(): void {
    this.apiService.getThresholds().subscribe({
      next: (response) => {
        this.thresholds = response.thresholds;
      },
      error: (err) => console.error('Fehler beim Laden der Bewertungsgrenzen:', err)
    });
  }

  // Studenten aus der API laden
  loadStudents(): void {
    this.apiService.getEXamData().subscribe({
      next: (response) => {
        this.students = response.students;
        if (this.students.length > 0) {
          this.tasks = Object.keys(this.students[0].scores);
        }

        this.students.forEach(student => this.updateBewertung(student));
      },
      error: (err) => console.error('Fehler beim Laden der Studenten:', err)
    });
  }

  // Aktualisierung der Punktzahlen mit Überprüfung der maximalen Grenze
  updateScore(student: Student, task: string, value: number): void {
    const maxValue = this.taskWeights[task] || 0;
    const studentId = student.mtknr.toString();

    if (!this.scoreErrors[studentId]) {
      this.scoreErrors[studentId] = {};
    }

    if (value > maxValue) {
      this.scoreErrors[studentId][task] = `Die Note darf ${maxValue} für ${task} nicht überschreiten`;
      student.scores[task] = 0;
    } else {
      this.scoreErrors[studentId][task] = '';
      student.scores[task] = value >= 0 ? value : 0;
    }

    student.total = Object.values(student.scores).reduce((sum, score) => sum + (score || 0), 0);
    this.updateBewertung(student);
  }


  // Aktualisierung der Bewertung und der Note
  updateBewertung(student: Student): void {

    if (!student.scores) {
      student.scores = {};
    }
    student.total = Object.values(student.scores)
      .map(score => (isNaN(score) || score === null || score === undefined ? 0 : Number(score)))
      .reduce((sum, score) => sum + score, 0);

    if (student.total === 0) {
      student.bewertung = null;
      student.note = "";
      return;
    }

    student.bewertung = getBewertung(student.total, this.thresholds);
    student.note = isNaN(student.bewertung) ? "" : getNote(student.bewertung);
  }


  // Importation de fichier CSV
  onFileSelected(event: any): void {
    this.file = event.target.files[0];
  }



  uploadFile(): void {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);

      this.apiService.uploadCSV(formData).subscribe({
        next: (response) => {
          console.log("Response API :", response);

          this.students = response.students || [];
          this.tasks = this.students.length > 0 && this.students[0].scores ? Object.keys(this.students[0].scores) : [];

          this.students.forEach(student => this.updateBewertung(student));
          this.saveStateBeforeLeave();
          this.saveMessage = 'Datei wurde erfolgreich importiert!';
          this.isFileUploaded = true;
          setTimeout(() => this.saveMessage = '', 3000);
        },
        error: () => {
          this.fileError = 'Fehler beim Importieren der Datei. Überprüfen Sie das CSV-Format.';
          setTimeout(() => this.fileError = '', 3000);
        }
      });
    }
  }




  // Hinzufügen einer Aufgabe mit Gewichtung
  addTask(): void {
    if (this.newTask && !this.tasks.includes(this.newTask) && this.newTaskWeight > 0) {
      const weightingOfExercice = { [this.newTask]: this.newTaskWeight };

      this.apiService.addExercice([this.newTask], weightingOfExercice).subscribe({
        next: () => {
          this.tasks.push(this.newTask);
          this.taskWeights[this.newTask] = this.newTaskWeight;

          this.students.forEach(student => {
            if (!student.scores) student.scores = {};
            student.scores[this.newTask] = 0;
          });

          this.newTask = '';
          this.newTaskWeight = 0;
          this.taskMessage = 'Aufgabe erfolgreich hinzugefügt!';
          setTimeout(() => this.taskMessage = '', 3000);
        },
        error: () => {
          this.taskMessage = 'Fehler beim Hinzufügen einer Aufgabe.';
        }
      });
    } else {
      this.taskError = 'Bitte geben Sie den Namen der Aufgabe und ihre Gewichtung an.';
      setTimeout(() => { this.taskMessage = ''; this.taskError = ''; }, 3000);
    }
  }

  // delete Task
  removeTask(task: string): void {
    this.apiService.deleteExercice(task).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(e => e !== task);
        this.students.forEach(student => {
          if (student.scores && task in student.scores) {
            delete student.scores[task];
          }
        });
        this.saveMessage = 'Aufgabe erfolgreich gelöscht!';
        setTimeout(() => this.saveMessage = '', 3000);
      },
      error: () => {
        this.saveMessage = 'Fehler beim Löschen der Aufgabe.';
      }
    });
  }

  // Daten speichern
  saveData(): void {
    const data = {
      students: this.students.map(student => ({
        ...student,
        total: Object.values(student.scores || {}).reduce((sum, score) => sum + (score || 0), 0),
        bewertung: student.bewertung,
        note: student.note
      })),
      exercises: this.tasks.reduce((obj: { [key: string]: number }, task: string) => {
        obj[task] = this.taskWeights[task] || 0;
        return obj;
      }, {})
    };

    this.apiService.saveStudentData(data).subscribe({
      next: () => {
        this.saveMessage = 'Daten wurden erfolgreich gespeichert!';
        this.isSaved = true;
        this.saveStateBeforeLeave();
        setTimeout(() => this.saveMessage = '', 3000);
      },
      error: () => {
        this.saveMessage = 'Fehler beim Speichern von Daten.';
        this.isSaved = false;
      }
    });
  }


  exportCSV(): void {
    if (this.exportCsvComp) {
      this.exportCsvComp.downloadCsvData();
    }
  }

  exportEXcel(): void {
    if (this.exportExcelComp) {
      this.exportExcelComp.downloadExcelData();
    }
  }

  exportPdf(): void {
    if (this.exportPdfComp) {
      this.exportPdfComp.downloadPDF();
    }
  }


  saveStateBeforeLeave(): void {
    if (window.electron) {
      window.electron.saveData({
        students: this.students,
        taskWeights: this.taskWeights
      });
    }
  }
  

  navigateToPrevious(): void {
    this.saveStateBeforeLeave();
    this.router.navigate(['/threshold']);
  }

  navigateToStart(): void {
    this.router.navigate(['/module']);
  }
}
