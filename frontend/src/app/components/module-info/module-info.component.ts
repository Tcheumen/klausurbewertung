import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importer le service de routage
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ModuleInfo } from '../../models/moduleInfo';

@Component({
  selector: 'app-module-info',
  imports: [CommonModule, FormsModule],
  templateUrl: './module-info.component.html',
  styleUrls: ['./module-info.component.scss']
})
export class ModuleInfoComponent implements OnInit {
  
  moduleInfo: ModuleInfo = { moduleTitle: '', moduleNumber: '', examDate: '', examiners: []};
  isEditing = false;
  isSaved = false;
  saveMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {} 

  ngOnInit(): void {
    this.loadModuleInfo();
  }

  loadModuleInfo(): void {
    this.apiService.getModule().subscribe(
      (response) => (this.moduleInfo = response.moduleInfo),
      () => console.error('No module info found')
    );
  }

  saveModule(): void {
    if (this.isEditing) {
      this.apiService.updateModule(this.moduleInfo).subscribe(() => {
        this.saveMessage = ' Modul erfolgreich aktualisiert !';
        this.isEditing = false;
        this.isSaved = true; 
        setTimeout(() => this.saveMessage = '', 3000);
      });
    } else {
      this.apiService.addModule(this.moduleInfo).subscribe(() => {
        this.saveMessage = ' Modul wurde erfolgreich hinzugefügt!';
        this.loadModuleInfo();
        this.isSaved = true; 
        setTimeout(() => this.saveMessage = '', 3000);
      });
    }
  }




  navigateToNext(): void {
    this.router.navigate(['/threshold']); 
  }
}
