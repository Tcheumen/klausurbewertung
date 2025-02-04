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

      // Charger l'ancien fichier JSON s'il existe
      let existingData = {};
      try {
        existingData = JSON.parse(fs.readFileSync(DATABASE_PATH, 'utf8'));
      } catch (error) {
        console.warn('Aucun fichier JSON existant, création d’un nouveau fichier.');
      }

      // Conserver les autres champs (comme thresholds) et mettre à jour uniquement students
      const updatedData = {
        ...existingData,
        students: normalizedStudents,// Mettre à jour uniquement les étudiants
        
        weightingOfExercice: {},
        
       
      };

      // Sauvegarder les données mises à jour dans le fichier JSON
      fs.writeFileSync(DATABASE_PATH, JSON.stringify(updatedData, null, 2));

      // Répondre avec succès
      res.json({ message: 'Fichier uploadé avec succès', students: normalizedStudents });
    })
    .on('error', (error) => {
      console.error('Erreur lors du traitement du fichier CSV:', error);
      res.status(500).json({ message: 'Erreur lors du traitement du fichier', error });
    });
};

// Récupérer les données depuis le fichier JSON

const getStudent = (req, res) => {
    if (fs.existsSync(DATABASE_PATH)) {
        const data = fs.readFileSync(DATABASE_PATH, 'utf8');
        res.json(JSON.parse(data));
    } else {
        res.status(404).json({ message: 'No data found' })
    }
};

// Sauvegarder les données dans le fichier JSON

const saveStudent = (req, res) => {
  const data = req.body;

  if (!data || !Array.isArray(data.students) || typeof data.exercises !== 'object') {
    return res.status(400).json({ message: 'Invalid data format' });
  }

  try {
    // Charger les données existantes
    let existingData = {};
    try {
      existingData = JSON.parse(fs.readFileSync(DATABASE_PATH, 'utf8'));
    } catch (error) {
      console.warn('No existing data found, creating a new file.');
    }

    // Fusionner les nouvelles données tout en conservant les anciens champs
    const updatedData = {
      ...existingData,
      students: data.students, // Met à jour uniquement les étudiants
       weightingOfExercice: {
        ...existingData.weightingOfExercice, // Conserver les exercices existants
        ...data.exercises, // Ajouter ou mettre à jour les exercices
      },
     
      
    };

    // Sauvegarder les données mises à jour
    fs.writeFileSync(DATABASE_PATH, JSON.stringify(updatedData, null, 2));
    res.json({ message: 'Data successfully saved' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Error saving data' });
  }
};

// Ajouter une nouvelle tâche
const addTask = (req, res) => {
  try {
    const { tasks, weightingOfExercice } = req.body;

    // Validation des entrées
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ message: 'A valid list of tasks is required' });
    }

    if (!weightingOfExercice || typeof weightingOfExercice !== 'object') {
      return res.status(400).json({ message: 'A valid weighting object is required' });
    }

    // Charger ou initialiser la base de données
    let data = {
      students: [],
      weightingOfExercice: {}
    };

    if (fs.existsSync(DATABASE_PATH)) {
      const rawData = fs.readFileSync(DATABASE_PATH, 'utf8');
      if (rawData.trim()) {
        data = JSON.parse(rawData);
      }
    }

    // Ajouter les pondérations
    data.weightingOfExercice = { ...data.weightingOfExercice, ...weightingOfExercice };

    // Ajouter les nouvelles tâches aux étudiants
    data.students = data.students.map(student => {
      if (!student.scores) {
        student.scores = {};
      }

      tasks.forEach(task => {
        if (!(task in student.scores)) {
          student.scores[task] = 0; // Initialisation à 0
        }
      });

      // Recalculer le total des scores
      student.total = Object.values(student.scores).reduce((sum, score) => sum + score, 0);

      return student;
    });

    // Sauvegarder les changements
    fs.writeFileSync(DATABASE_PATH, JSON.stringify(data, null, 2));

    res.json({ message: 'Tasks and weightings added successfully', data });
  } catch (error) {
    console.error('Error in addTask:', error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};



// Supprimer une tâche
const deleteTask = (req, res) => {
  try {
    const { task } = req.body;

    if (!task) {
      return res.status(400).json({ message: 'Task is required' });
    }

    if (fs.existsSync(DATABASE_PATH)) {
      const rawData = fs.readFileSync(DATABASE_PATH, 'utf8');
      const data = JSON.parse(rawData);

      // Vérifier si la tâche existe dans les pondérations
      if (data.weightingOfExercice && task in data.weightingOfExercice) {
        delete data.weightingOfExercice[task]; // Supprimer la pondération
      }

      // Supprimer la tâche des scores de chaque étudiant
      data.students = data.students.map(student => {
        if (student.scores && task in student.scores) {
          delete student.scores[task];
        }
        // Recalculer le total des scores
        student.total = Object.values(student.scores || {}).reduce((sum, score) => sum + score, 0);
        return student;
      });

      // Sauvegarder les modifications
      fs.writeFileSync(DATABASE_PATH, JSON.stringify(data, null, 2));

      res.json({ message: 'Task deleted successfully', data });
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (error) {
    console.error('Error in deleteTask:', error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};


// Mettre à jour une tâche
const updateTask = (req, res) => {
  try {
    const { oldTask, newTask } = req.body;

    if (!oldTask || !newTask) {
      return res.status(400).json({ message: 'Both oldTask and newTask are required' });
    }

    if (fs.existsSync(DATABASE_PATH)) {
      const rawData = fs.readFileSync(DATABASE_PATH, 'utf8');
      const data = JSON.parse(rawData);

      // Mettre à jour la pondération
      if (data.weightingOfExercice && oldTask in data.weightingOfExercice) {
        data.weightingOfExercice[newTask] = data.weightingOfExercice[oldTask];
        delete data.weightingOfExercice[oldTask];
      }

      // Mettre à jour la tâche dans les scores de chaque étudiant
      data.students = data.students.map(student => {
        if (student.scores && oldTask in student.scores) {
          student.scores[newTask] = student.scores[oldTask];
          delete student.scores[oldTask];
        }
        // Recalculer le total des scores
        student.total = Object.values(student.scores || {}).reduce((sum, score) => sum + score, 0);
        return student;
      });

      // Sauvegarder les modifications
      fs.writeFileSync(DATABASE_PATH, JSON.stringify(data, null, 2));

      res.json({ message: 'Task updated successfully', data });
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (error) {
    console.error('Error in updateTask:', error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};



module.exports = {
    uploadCSV,
    getStudent, 
    saveStudent,
   // exportCSV,
    addTask,
    deleteTask,
    updateTask
};
