import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Student } from '../models/student';

@Injectable({ providedIn: 'root' })
export class SharedDataService {
    private studentsSource = new BehaviorSubject<Student[]>([]);
    students$ = this.studentsSource.asObservable();

    private tasksSource = new BehaviorSubject<string[]>([]);
    tasks$ = this.tasksSource.asObservable();

    setStudents(students: Student[]) {
        this.studentsSource.next(students);
    }

    setTasks(tasks: string[]) {
        this.tasksSource.next(tasks);
    }
}
