const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { error } = require('console');

const DATABASE_PATH = path.join(__dirname, '../data/database.json');

// Charger un fichier CSV et enregistrer les données dans le JSON

const uploadCSV = (req, res) => {
  // Vérifiez si aucun fichier n'a été fourni
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier trouvé' });
  }

  const filePath = req.file.path; // Chemin temporaire du fichier CSV
  const students = [];

  // Lire et traiter le fichier CSV
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
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

module.exports = {
    uploadCSV,
    getData, 
    saveData
}