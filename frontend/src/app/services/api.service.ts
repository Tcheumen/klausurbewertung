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

  // Télécharger un fichier CSV

  uploadCSV(data: FormData): Observable<{ students: Student[] }> {
    return this.http.post<{ students: Student[] }>(`${this.baseUrl}/api/data/upload`, data);
  }

  // Exporter un fichier Excel
  exportExcel(): Observable<Blob>{
    return this.http.post(`${this.baseUrl}/api/export/excel`, {}, { responseType: 'blob' });
  }

  exportExcelData(): Observable<Blob>{
    return this.http.get(`${this.baseUrl}/api/export/excel-data`, { responseType: 'blob' });
  }

  // Exporter un fichier PDF
  exportPDF(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/api/export/pdf`,  { responseType: 'blob' });
  }

  
  
  saveStudentData(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/data`, data);
  }

  // Récupérer les données enregistrées
  getEXamData(): Observable<{ students: Student[]; exam: Exam }>{
    return this.http.get<{ students: Student[]; exam: Exam }>(`${this.baseUrl}/api/data`);
  }

  exportExamDataCSV(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/api/export/csv`, { responseType: 'blob' });
  }

  addExercice(tasks: string[], weightingOfExercice: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/data/addTask`, { tasks, weightingOfExercice });
  }

  updateExercice(oldTask: string, newTask: string): Observable<any>{
    return this.http.put(`${this.baseUrl}/data/updateTask`, { oldTask, newTask });
  }

  deleteExercice(task: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/data/deleteTask`, { body: { task } });
  }



  addThreshold(threshold: Threshold): Observable<{ message: string; thresholds: Threshold[] }> {
    return this.http.post<{ message: string; thresholds: Threshold[] }>(`${this.baseUrl}/api/data/add-threshold`, threshold);
  }

  deleteThreshold(percentage: number): Observable<{ message: string; thresholds: Threshold[] }> {
    return this.http.delete<{ message: string; thresholds: Threshold[] }>(
      `${this.baseUrl}/api/data/delete-threshold`,
      { body: { percentage } }
    );
  }


 
  getThresholds(): Observable<{ thresholds: Threshold[] }> {
    return this.http.get<{ thresholds: Threshold[] }>(`${this.baseUrl}/api/data/get-threshold`);
  }

  saveThresholds(thresholds: Threshold[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/data/save-threshold`, { thresholds });
  }

  getStudentBewertung(studentId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/students/${studentId}/bewertung`);
  }

  getStudentNote(studentId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/students/${studentId}/note`);
  }

  updateStudentScores(studentId: string, scores: { [task: string]: number }) {
    return this.http.put<{ total: number, bewertung: number, note: string }>(
      `/api/students/${studentId}/scores`,
      { scores }
    );
  }

  //api Module

  addModule(moduleInfo: ModuleInfo): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/data/add-module`, moduleInfo);
  }

  getModule(): Observable<{moduleInfo: ModuleInfo }> {
    return this.http.get<{ moduleInfo: ModuleInfo }>(`${this.baseUrl}/api/data/get-module`);
  }

  updateModule(modueleInfo: ModuleInfo): Observable<any>{
    return this.http.put(`${this.baseUrl}/api/data/update-module`, modueleInfo);
  }

 

}
