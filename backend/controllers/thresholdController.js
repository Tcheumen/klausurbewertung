const fs = require('fs');
const path = require('path');

const DATABASE_PATH = path.join(__dirname, '../data/database.json');

// Ajouter un seuil

const addThreshold = (req, res) => {
  let { points, percentage, note } = req.body;

  // Convertir en nombres
  points = Number(points);
  percentage = Number(percentage);
  note = Number(note);

  if (isNaN(points) || isNaN(percentage) || isNaN(note)) {
    return res.status(400).json({ message: 'All fields must be numbers' });
  }

  if (fs.existsSync(DATABASE_PATH)) {
    const rawData = fs.readFileSync(DATABASE_PATH, 'utf8');
    const data = JSON.parse(rawData);

    if (!data.thresholds) {
      data.thresholds = [];
    }

    // Vérifier si le seuil existe déjà (même points, percentage et note)
    const exists = data.thresholds.some(
      (threshold) => 
        threshold.points === points &&
        threshold.percentage === percentage &&
        threshold.note === note
    );

    if (exists) {
      return res.status(400).json({ message: 'Threshold already exists' });
    }

    // Ajouter un nouveau seuil
    data.thresholds.push({ points, percentage, note });

    // Sauvegarder les modifications
    fs.writeFileSync(DATABASE_PATH, JSON.stringify(data, null, 2));
    res.json({ message: 'Threshold added successfully', thresholds: data.thresholds });
  } else {
    res.status(404).json({ message: 'No data found' });
  }
};


// Supprimer un seuil
const deleteThreshold = (req, res) => {
  const { percentage } = req.body;

  if (percentage === undefined) {
    return res.status(400).json({ message: 'Percentage is required' });
  }

  if (fs.existsSync(DATABASE_PATH)) {
    const rawData = fs.readFileSync(DATABASE_PATH, 'utf8');
    const data = JSON.parse(rawData);

    if (!data.thresholds) {
      return res.status(404).json({ message: 'No thresholds found' });
    }

    // Supprimer le seuil correspondant au pourcentage
    data.thresholds = data.thresholds.filter(threshold => threshold.percentage !== percentage);

    // Sauvegarder les modifications
    fs.writeFileSync(DATABASE_PATH, JSON.stringify(data, null, 2));
    res.json({ message: 'Threshold deleted successfully', thresholds: data.thresholds });
  } else {
    res.status(404).json({ message: 'No data found' });
  }
};




// Récupérer tous les seuils
const getThresholds = (req, res) => {
  if (fs.existsSync(DATABASE_PATH)) {
    const rawData = fs.readFileSync(DATABASE_PATH, 'utf8');
    const data = JSON.parse(rawData);

    if (!data.thresholds || data.thresholds.length === 0) {
      return res.status(404).json({ message: 'No thresholds found' });
    }

    // Trier les seuils par "percentage" avant de les retourner
    data.thresholds.sort((a, b) => a.percentage - b.percentage);

    res.json({ thresholds: data.thresholds });
  } else {
    res.status(404).json({ message: 'No data found' });
  }
};


// Sauvegarder tous les seuils
const saveAllThresholds = (req, res) => {
  const { thresholds } = req.body;

  if (!Array.isArray(thresholds)) {
    return res.status(400).json({ message: 'Thresholds must be an array' });
  }

  // Validation des seuils
  for (const threshold of thresholds) {
    const { points, percentage, note } = threshold;
    if (isNaN(Number(points)) || isNaN(Number(percentage)) || isNaN(Number(note))) {
      return res.status(400).json({ message: 'All threshold fields must be valid numbers' });
    }
  }

  if (fs.existsSync(DATABASE_PATH)) {
    const rawData = fs.readFileSync(DATABASE_PATH, 'utf8');
    const data = JSON.parse(rawData);

    // Trier les seuils par "percentage" avant de les sauvegarder
    data.thresholds = thresholds.sort((a, b) => a.percentage - b.percentage);

    // Sauvegarder les modifications
    fs.writeFileSync(DATABASE_PATH, JSON.stringify(data, null, 2));
    res.json({ message: 'All thresholds saved successfully', thresholds: data.thresholds });
  } else {
    res.status(404).json({ message: 'No data found' });
  }
};



module.exports = {
  addThreshold,
  deleteThreshold,
  getThresholds,
  saveAllThresholds
};
