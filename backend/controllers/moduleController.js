const fs = require('fs');
const path = require('path');

const DATABASE_PATH = path.join(__dirname, '../data/database.json');

// Ajouter des informations sur le module
const addModuleInfo = (req, res) => {
  let { moduleTitle, moduleNumber, examDate, examiners} = req.body;

  if (!moduleTitle || !moduleNumber || !examDate || !examiners ) {
    return res.status(400).json({ message: 'All module information fields are required' });
  }

  if (fs.existsSync(DATABASE_PATH)) {
    const rawData = fs.readFileSync(DATABASE_PATH, 'utf8');
    const data = JSON.parse(rawData);

    data.moduleInfo = { moduleTitle, moduleNumber, examDate, examiners };

    // Sauvegarder les modifications
    fs.writeFileSync(DATABASE_PATH, JSON.stringify(data, null, 2));
    res.json({ message: 'Module information added successfully', moduleInfo: data.moduleInfo });
  } else {
    res.status(404).json({ message: 'No data found' });
  }
};

// Récupérer les informations du module
const getModuleInfo = (req, res) => {
  if (fs.existsSync(DATABASE_PATH)) {
    const rawData = fs.readFileSync(DATABASE_PATH, 'utf8');
    const data = JSON.parse(rawData);

    if (!data.moduleInfo) {
      return res.status(404).json({ message: 'No module information found' });
    }

    res.json({ moduleInfo: data.moduleInfo });
  } else {
    res.status(404).json({ message: 'No data found' });
  }
};



// Mettre à jour les informations du module
const updateModuleInfo = (req, res) => {
  let { moduleTitle, moduleNumber, examDate, examiners } = req.body;

  if (!moduleTitle || !moduleNumber || !examDate || !examiners ) {
    return res.status(400).json({ message: 'All module information fields are required' });
  }

  if (fs.existsSync(DATABASE_PATH)) {
    const rawData = fs.readFileSync(DATABASE_PATH, 'utf8');
    const data = JSON.parse(rawData);

    if (!data.moduleInfo) {
      return res.status(404).json({ message: 'No module information found' });
    }

    data.moduleInfo = { moduleTitle, moduleNumber, examDate, examiners };

    // Sauvegarder les modifications
    fs.writeFileSync(DATABASE_PATH, JSON.stringify(data, null, 2));
    res.json({ message: 'Module information updated successfully', moduleInfo: data.moduleInfo });
  } else {
    res.status(404).json({ message: 'No data found' });
  }
};

module.exports = {
  addModuleInfo,
  getModuleInfo,
  
  updateModuleInfo
};
