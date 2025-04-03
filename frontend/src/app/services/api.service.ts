import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Student } from '../models/student';
import { Threshold } from '../models/threshold';
import { ModuleInfo } from '../models/moduleInfo';
import { Exam } from '../models/exam';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

 
  // CSV-Datei hochladen
  uploadCSV(data: FormData): Observable<{ students: Student[] }> {
    return this.http.post<{ students: Student[] }>(`${this.baseUrl}/api/data/upload`, data);
  }

  // Excel-Datei exportieren
  exportExcel(): Observable<Blob>{
    return this.http.post(`${this.baseUrl}/api/export/excel`, {}, { responseType: 'blob' });
  }

  exportExcelData(): Observable<Blob>{
    return this.http.get(`${this.baseUrl}/api/export/excel-data`, { responseType: 'blob' });
  }

  // PDF-Datei exportieren
  exportPDF(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/api/export/pdf`,  { responseType: 'blob' });
  }

  
  // Studierendendaten speichern
  saveStudentData(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/data`, data);
  }

  // Gespeicherte Daten abrufen
  getEXamData(): Observable<{ students: Student[]; exam: Exam }>{
    return this.http.get<{ students: Student[]; exam: Exam }>(`${this.baseUrl}/api/data`);
  }

  // CSV-Export der Prüfungsdaten
  exportExamDataCSV(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/api/export/csv`, { responseType: 'blob' });
  }

  // Aufgabe hinzufügen
  addExercice(tasks: string[], weightingOfExercice: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/data/addTask`, { tasks, weightingOfExercice });
  }

  // Aufgabe aktualisieren
  updateExercice(oldTask: string, newTask: string): Observable<any>{
    return this.http.put(`${this.baseUrl}/data/updateTask`, { oldTask, newTask });
  }

  // Aufgabe löschen
  deleteExercice(task: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/data/deleteTask`, { body: { task } });
  }


  // Bewertungsschwelle hinzufügen
  addThreshold(threshold: Threshold): Observable<{ message: string; thresholds: Threshold[] }> {
    return this.http.post<{ message: string; thresholds: Threshold[] }>(`${this.baseUrl}/api/data/add-threshold`, threshold);
  }

  // Bewertungsschwelle löschen
  deleteThreshold(percentage: number): Observable<{ message: string; thresholds: Threshold[] }> {
    return this.http.delete<{ message: string; thresholds: Threshold[] }>(
      `${this.baseUrl}/api/data/delete-threshold`,
      { body: { percentage } }
    );
  }


 // Bewertungsschwellen abrufen
  getThresholds(): Observable<{ thresholds: Threshold[] }> {
    return this.http.get<{ thresholds: Threshold[] }>(`${this.baseUrl}/api/data/get-threshold`);
  }

  // Bewertungsschwellen speichern
  saveThresholds(thresholds: Threshold[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/data/save-threshold`, { thresholds });
  }

  // Bewertung eines Studierenden abrufen
  getStudentBewertung(studentId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/students/${studentId}/bewertung`);
  }

  // Note eines Studierenden abrufen
  getStudentNote(studentId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/students/${studentId}/note`);
  }

  // Punktzahlen eines Studierenden aktualisieren
  updateStudentScores(studentId: string, scores: { [task: string]: number }) {
    return this.http.put<{ total: number, bewertung: number, note: string }>(
      `/api/students/${studentId}/scores`,
      { scores }
    );
  }

  //api Module
  // Modul hinzufügen
  addModule(moduleInfo: ModuleInfo): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/data/add-module`, moduleInfo);
  }

  // Modul abrufen
  getModule(): Observable<{moduleInfo: ModuleInfo }> {
    return this.http.get<{ moduleInfo: ModuleInfo }>(`${this.baseUrl}/api/data/get-module`);
  }

  // Modul aktualisieren
  updateModule(modueleInfo: ModuleInfo): Observable<any>{
    return this.http.put(`${this.baseUrl}/api/data/update-module`, modueleInfo);
  } 

}
