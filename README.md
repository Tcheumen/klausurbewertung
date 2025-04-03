# 🎓 Klausurbewertung

## Einführung
Die Anwendung **Klausurbewertung** ist eine Desktop-App, die mit **Angular, Electron und Node.js** entwickelt wurde.  
Sie automatisiert die Bewertung von Prüfungsergebnissen, indem sie CSV-Dateien importiert und CSV, Excel- sowie PDF-Berichte generiert.

## Verwendete Technologien

- **Frontend**: [Angular CLI](https://angular.dev/) (v19)
- **Backend:**  [Node.js](https://nodejs.org/) (v20)
- **Desktop-Umgebung:** [Electron](https://www.electronjs.org/)
- **Datenbank:** JSON (lokale Datenspeicherung)
- **Programmiersprachen:** TypeScript, JavaScript
- **Unterstützte Dateiformate:** CSV, Excel (XLSX), PDF

## Projektstruktur

## 1. Backend (Ordner `backend`)
Das Backend basiert auf Node.js und Express.js und ist folgendermaßen organisiert:

- 📂 **`controllers/`** : Enthält die Controller, die verschiedene Backend-Funktionalitäten verwalten.  
  - `dataController.js` :  Verwaltung der Studierendendaten, der Aufgaben sowie des CSV-Datei-Imports, einschließlich Hochladen, Speichern.
  - `exportController.js` : Generierung von Pdf- CSV- und Excel-Dateien.  
  - `moduleController.js` : Verwaltung der Modulinformationen.  
  - `thresholdController.js` : Verwaltung der Notenschwellen.  
- 📂 **`data/`**  
  - `database.json` : Lokale Speicherung der Daten.  
- 📂 **`exports/`** : Ordner zur Speicherung der exportierten Dateien (CSV, Excel, PDF).
- 📂 **`routes/`** : Definiert API-Routen für die Interaktion mit dem Backend.  
  - `dataRoutes.js` : Routen für CSV-Upload,    Studierendenverwaltung und Aufgabenmanagement.  
  - `exportRoutes.js` : Routen für den Export von Daten als Excel, CSV und PDF. 
  - `moduleRoutes.js` : Routen für die Verwaltung von Modulen.  
  - `thresholdRoutes.js` : Routen für die Verwaltung von Notenschwellen. 
- 📂 **`services/`** : Enthält Backend-Services für die Verarbeitung von Dateien und Daten.  
  - `csvService.js` : Erzeugt eine CSV-Datei mit Studierendendaten, Aufgaben und Modulinformationen aus der Json Dateien.  
  - `excelService.js` : Erstellt eine Excel-Datei mit Studierendendaten, Aufgaben, Grenzwerten und Modulinformationen aus der Json Dateien.  
  - `pdfService.js` : Erzeugt einen Prüfungsbewertungsbericht als PDF mit Modulinformationen, Notenverteilung, Erfolgsraten und Diagrammen. 
- 📂 **`utils/`** : Enthält Hilfsfunktionen zur Datenverarbeitung.  
  - `chartGenerator.js` :Generiert Balken- und Radar-Diagramme zur Analyse von Notenverteilungen und Bestehensquoten. 
  - `normalize.js` :Konvertiert semikolongetrennte Studierendendaten in strukturierte Objekte.  
  - `studentsStatistics.js` : Verarbeitung von Studierendendaten zur Berechnung von Notenverteilung, Erfolgsquote und Durchschnittswerten pro Aufgabe.  
  - `tableDrawer.js` : Zeichnet zentrierte Tabellen in PDF-Dokumente.
- 📄 **`.env`** : Lädt Umgebungsvariablen und setzt den Standardport (3000).
- 📄 **`server.js`** : Express-Server mit Middleware, API-Routen und Fehlerbehandlung.  



### 2. **Frontend** (Ordner `frontend`)
Das Frontend wurde mit **Angular** entwickelt und hat folgende Struktur:

- 📂 **`src/`**  
  - 📂 **`app/`** : Enthält die Komponenten und Services der Anwendung.  
    - 📂 **`components/`** : Hauptkomponenten der Anwendung.  
      - `csvexport/` : Button zum Herunterladen eines CSV-Berichts per API-Aufruf.  
      - `export-excel/` : Button zum Herunterladen eines excel-Berichts per API-Aufruf. 
      - `home/` : Startseite der Anwendung.  
      - `module-info/` : Verwaltung der Modulinformationen. 
      - `navbar/` :Navigation für Home, Modul-, Schwell- und Notenverwaltung. 
      - `pdf-export/` : Button zum Herunterladen eines PDF-Berichts per API-Aufruf.  
      - `thresholds/` : Verwaltung von Notenschwellen.  
      - `upload/` : Verwaltung des CSV-Imports, Aufgabenmanagements, Noteneingabe und Datenexports (CSV, Excel, PDF).
    - 📂 **`models/`** : Definition der Datenmodelle.  
      - `exam.ts`, `exercice.ts`, `moduleInfo.ts`, `student.ts`, `threshold.ts`  
    - 📂 **`services/`** : Services zur Interaktion mit dem Backend.  
      - `api.service.ts` : Hauptservice für API-Anfragen.  
    - 📂 **`utils/`** : Berechnung der Bewertung basierend auf Punkteschwellen und Zuordnung der entsprechenden Note.
  - 📂 **`assets/`** : Enthält statische Ressourcen (HTML, CSS, Bilder).  
  - 📄 `main.ts` : Einstiegspunkt der Angular-Anwendung.  
  - 📄 `server.ts` : Konfiguration des Angular-Servers für Electron. 

  - **Wichtige Konfigurationen**  
  - `angular.json` : Angular-Konfiguration.  
  - `package.json` : Abhängigkeiten des Projekts.  
  - `tsconfig.json` : TypeScript-Konfiguration.  
  - `main.js` : Electron-Hauptprozess zur Verwaltung des Fensters und der persistenten Speicherung von Studierendendaten mit electron-store.
  - `preload.js` : Sicherer Bridge für Renderer-Hauptprozess-Kommunikation in Electron.

  ## Hauptfunktionen

### 1. **Import der Ergebnisse**
- Laden von **CSV-Dateien** mit Teilnehmern und deren Ergebnissen.  
- Zuordnung der Ergebnisse zu den definierten Übungen und Gewichtungen.  

### 2. **Verwaltung der Übungen**
- Definition der Übungen und deren **Gewichtung**.  
- Manuelle Eingabe der **Punkte pro Student**.  

### 3. **Berechnung und Bewertung**
- Automatische Berechnung der **Endnoten**.  
- Anwendung der **Notenschwellen** für die Bewertung.  
- Berechnung von **Statistiken** (Durchschnitt, Median, Standardabweichung).  

### 4. **Visualisierung und Berichte**  
- Generierung und **Export von Berichten** als **CSV, Excel und PDF**.  
- Anzeige der **Ergebnisse** in Tabellen und **Diagrammen**.
 

## Installation und Ausführung

### 1. **Installation der Abhängigkeiten**
```sh
# Installation des Backends
cd backend
npm install

# Installation des Frontends
cd ../frontend
npm install

```

### 2. **Starten der Anwendung**
```sh
# Backend starten
cd backend
node server.js

# Frontend mit Electron starten
cd ../frontend
npm run electron   
 
```

## Fazit
Dieses Projekt zielt darauf ab, die Prüfungsbewertung zu vereinfachen und zu automatisieren, indem es die mühsame Arbeit mit Excel-Dateien ersetzt. Durch die Integration von Angular, Node.js und Electron bietet es eine benutzerfreundliche Oberfläche und eine effiziente Datenverwaltung mit erweiterten Funktionen für den Import, die Berechnung und den Export von Ergebnissen.