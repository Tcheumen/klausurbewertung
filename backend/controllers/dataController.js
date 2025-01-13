const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const iconv = require('iconv-lite');
const { Parser } = require('json2csv');
const { error } = require('console');

const { normalizeData } = require('../utils/normalize');

const DATABASE_PATH = path.join(__dirname, '../data/database.json');




const uploadCSV = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier trouvé' });
  }

  const filePath = req.file.path; // Chemin temporaire du fichier CSV
  const students = [];

  fs.createReadStream(filePath)
    .pipe(iconv.decodeStream('latin1'))
    .pipe(iconv.encodeStream('utf8'))
    .pipe(csv())
    .on('data', (row) => {
      students.push(row); // Ajouter chaque ligne du fichier CSV dans le tableau
    })
    .on('end', () => {
      fs.unlinkSync(filePath); // Supprimer le fichier temporaire

      // Normaliser les données des étudiants
      const normalizedStudents = normalizeData(students);

      // Sauvegarder les données dans un fichier JSON
      const data = { students: normalizedStudents, exam: {} };
      fs.writeFileSync(DATABASE_PATH, JSON.stringify(data, null, 2));

      // Répondre avec succès
      res.json({ message: 'Fichier uploadé avec succès', students: normalizedStudents });
    })
    .on('error', (error) => {
      console.error('Erreur lors du traitement du fichier CSV:', error);
      res.status(500).json({ message: 'Erreur lors du traitement du fichier', error });
    });
};

// Charger un fichier CSV et enregistrer les données dans le JSON

/*
const uploadCSV = (req, res) => {
  // Vérifiez si aucun fichier n'a été fourni
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier trouvé' });
  }

  const filePath = req.file.path; // Chemin temporaire du fichier CSV
  const students = [];

  // Lire et traiter le fichier CSV
  fs.createReadStream(filePath)
    .pipe(csv({ separator: ';'}))
    .on('data', (row) => {
      const student = {
        mtknr: row['MatrikelNr'] || '',
        nachname: row['Nachname'] || '',
        vorname: row['Vorname'] || '',
        scores: {},
        total: 0,
      };

      Object.keys(row).forEach((key) => {
        if (key !== 'MatrikelNr' && key !== 'Nachname' && key !== 'Vorname') {
          student.scores[key] = parseFloat(row[key]) || 0;
        }
      });
      students.push(row); // Ajouter chaque ligne du fichier CSV dans le tableau
    })
    .on('end', () => {
      // Supprimer le fichier temporaire après traitement
      //fs.unlinkSync(filePath);

      // Sauvegarder les données dans un fichier JSON
      const data = { students, exam: {} };
      fs.writeFileSync(DATABASE_PATH, JSON.stringify(data, null, 2));

      // Répondre avec succès
      res.json({ message: 'Fichier uploadé avec succès', students });
    })
    .on('error', (error) => {
      console.error('Erreur lors du traitement du fichier CSV:', error);

      // Répondre avec une erreur
      res.status(500).json({ message: 'Erreur lors du traitement du fichier', error });
    });
};
*/

// Récupérer les données depuis le fichier JSON

const getData = (req, res) => {
    if (fs.existsSync(DATABASE_PATH)) {
        const data = fs.readFileSync(DATABASE_PATH, 'utf8');
        res.json(JSON.parse(data));
    } else {
        res.status(404).json({ message: 'No data found' })
    }
};

// Sauvegarder les données dans le fichier JSON

const saveData = (req, res) => {
    const data = req.body;
    fs.writeFileSync(DATABASE_PATH, JSON.stringify(data, null, 2));
    res.json({ message: 'Data successfully saved' })
};

// Exporter les données en fichier CSV
const exportCSV = (req, res) => {
  if (fs.existsSync(DATABASE_PATH)) {
    const rawData = fs.readFileSync(DATABASE_PATH, 'utf8');
    const { students, exercises } = JSON.parse(rawData);

    // Définir les colonnes du fichier CSV
    const fields = ['MatrikelNr','Nachname', 'Vorname', ...exercises, 'Total'];
    const rows = students.map(student => {
      const row = {
        MatrikelNr: student.mtknr,
        Nachname: student.nachname || '', // Nom (par défaut vide si absent)
        Vorname: student.vorname || '',
        Total: student.total || 0, // Total (par défaut 0 si absent)
      };

      // Ajouter les scores pour chaque exercice, avec valeur par défaut 0
      exercises.forEach(exercise => {
        row[exercise] = student.scores?.[exercise] || 0;
      });

      return row;
    });

    try {
      // Créer l'entête et les lignes avec point-virgule comme séparateur
      const separator = ';'; // Utilisez ',' si votre Excel attend des virgules
      const header = fields.join(separator);
      const data = rows
        .map(row =>
          fields
            .map(field =>
              typeof row[field] === 'string' && row[field].includes(separator)
                ? `"${row[field]}"`
                : row[field]
            )
            .join(separator)
        )
        .join('\n');

      const csv = `\uFEFF${header}\n${data}`;

      // Envoi du fichier CSV
      res.header('Content-Type', 'text/csv; charset=utf-8');
      res.attachment('exam_data.csv');
      res.send(csv);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de l’exportation du fichier CSV', error });
    }
  } else {
    res.status(404).json({ message: 'Aucune donnée trouvée' });
  }
};





module.exports = {
    uploadCSV,
    getData, 
    saveData,
    exportCSV,
}