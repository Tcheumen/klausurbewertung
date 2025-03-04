const fs = require('fs');
const path = require('path');

const DATABASE_PATH = path.join(__dirname, '../data/database.json');

const exportCSV = () => {
  if (fs.existsSync(DATABASE_PATH)) {
    const rawData = fs.readFileSync(DATABASE_PATH, 'utf8');
    const { students, exercises, moduleInfo } = JSON.parse(rawData);

    const exerciseList = Array.isArray(exercises) ? exercises : Object.keys(exercises || {});

    const fields = ['MatrikelNr', 'Nachname', 'Vorname', 'Pversuch', 'Pvermerk', 'Sitzplatz', ...exerciseList, 'Gesamt', 'Bewertung'];

    const rows = students.map(student => {
      const hasScores = student.scores && Object.keys(student.scores).length > 0;

      const row = {
        MatrikelNr: student.mtknr || '',
        Nachname: student.nachname || '',
        Vorname: student.vorname || '',
        Pversuch: student.pversuch || '',
        Pvermerk: student.pvermerk || '',
        Sitzplatz: student.sitzplatz || '',
      };

      exerciseList.forEach(exercise => {
        row[exercise] = hasScores ? (student.scores?.[exercise] || '') : '';
      });

      const total = Object.values(student.scores || {}).reduce((sum, score) => sum + (score || 0), 0);
      row['Gesamt'] = total ? String(total).padStart(23, ' ').toString().replace('.', ',') : String('ne').padStart(24, ' ').toString().replace('.', ',');
      
      row['Bewertung'] = student.bewertung || String('ne').padStart(24, ' ');

      return row;
    });

    const separator = ';';
    const header = fields.join(separator);
    const data = rows
      .map(row =>
        fields
          .map(field =>
            typeof row[field] === 'string' && row[field].includes(separator) && field !== 'Gesamt'
              ? `"${row[field]}"` 
              : row[field]
          )
          .join(separator)
      )
      .join('\n');

    const moduleInfoHeader = `Module Title${separator}Module Number${separator}Prüfungsdatum${separator}Prüfer${separator}Exportdatum\n`;
    const moduleInfoData = `${moduleInfo.moduleTitle}${separator}${moduleInfo.moduleNumber}${separator}${moduleInfo.examDate}${separator}${moduleInfo.examiners.join(', ')}${separator}${new Date().toLocaleDateString()}\n`;

    const csv = `\uFEFF${moduleInfoHeader}${moduleInfoData}\n${header}\n${data}`;

    return csv;
  } else {
    throw new Error('No data saved found in database.json');
  }
};

module.exports = {
  exportCSV,
};
