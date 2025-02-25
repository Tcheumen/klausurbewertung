import { Routes } from '@angular/router';
import { UploadComponent } from './components/upload/upload.component';
import { ExportEXcelComponent } from './components/export-excel/export-excel.component';
import { ThresholdsComponent } from './components/thresholds/thresholds.component';
import { PdfExportComponent } from './components/pdf-export/pdf-export.component';
import { ModuleInfoComponent } from './components/module-info/module-info.component';
import { CsvexportComponent } from './components/csvexport/csvexport.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    { path: 'upload', component: UploadComponent },
    { path: 'excel', component: ExportEXcelComponent },
    { path: 'threshold', component: ThresholdsComponent },
    { path: 'pdf', component: PdfExportComponent },
    { path: 'module', component: ModuleInfoComponent },
    { path: 'csv', component: CsvexportComponent },
    { path: '', component: HomeComponent }
];
