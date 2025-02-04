const fs = require('fs');
const path = require('path');

const DATABASE_PATH = path.join(__dirname, '../data/database.json');

const exportCSV = () => {
  if (fs.existsSync(DATABASE_PATH)) {
    const rawData = fs.readFileSync(DATABASE_PATH, 'utf8');
    const { students, exercises } = JSON.parse(rawData);

    // Assurez-vous que exercises est un tableau ou un objet
    const exerciseList = Array.isArray(exercises) ? exercises : Object.keys(exercises || {});

    // Définir les colonnes du fichier CSV (Ajout de 'Bewertung')
    const fields = ['MatrikelNr', 'Nachname', 'Vorname', 'Pversuch', 'Pvermerk', 'Sitzplatz', ...exerciseList, 'Total', 'Bewertung'];

    const rows = students.map(student => {
      // Vérifiez si l'étudiant a des scores valides
      const hasScores = student.scores && Object.keys(student.scores).length > 0;

      // Initialisez une ligne avec les informations de base
      const row = {
        MatrikelNr: student.mtknr || '',
        Nachname: student.nachname || '',
        Vorname: student.vorname || '',
        Pversuch: student.pversuch || '',
        Pvermerk: student.pvermerk || '',
        Sitzplatz: student.sitzplatz || '',
      };

      // Ajoutez les scores pour chaque exercice, ou laissez vide si aucun score
      exerciseList.forEach(exercise => {
        row[exercise] = hasScores ? (student.scores?.[exercise] || '') : ''; // Champ vide si pas de score
      });

      // Calcul du total des scores (ou "ne" si aucun score)
      const total = Object.values(student.scores || {}).reduce((sum, score) => sum + (score || 0), 0);
      row['Total'] = total || 'ne'; // Met "ne" si pas de score total

      // Ajout de la colonne "Bewertung"
      row['Bewertung'] = student.bewertung || ''; // Met une valeur vide si non défini

      return row;
    });

    const separator = ';'; // Utilisez ',' si votre logiciel exige des virgules
    const header = fields.join(separator);
    const data = rows
      .map(row =>
        fields
          .map(field =>
            typeof row[field] === 'string' && row[field].includes(separator)
              ? `"${row[field]}"` // Ajouter des guillemets si le champ contient un séparateur
              : row[field]
          )
          .join(separator)
      )
      .join('\n');

    const csv = `\uFEFF${header}\n${data}`;

    return csv;
  } else {
    throw new Error('No data saved found in database.json');
  }
};

module.exports = {
  exportCSV,
};
