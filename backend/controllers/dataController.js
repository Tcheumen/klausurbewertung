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
    return res.status(400).json({ error: 'No files found.' });
  }

  const filePath = req.file.path;
  const students = [];

  fs.createReadStream(filePath)
    .pipe(iconv.decodeStream('latin1'))
    .pipe(iconv.encodeStream('utf8'))
    .pipe(csv())
    .on('data', (row) => {
      students.push(row); 
    })
    .on('end', () => {
      fs.unlinkSync(filePath); 
      const normalizedStudents = normalizeData(students);

      let existingData = {};
      try {
        existingData = JSON.parse(fs.readFileSync(DATABASE_PATH, 'utf8'));
      } catch (error) {
        console.warn('No existing JSON file, create a new file.');
      }

      const updatedData = {
        ...existingData,
        students: normalizedStudents,
        weightingOfExercice: {},
    
      };

      fs.writeFileSync(DATABASE_PATH, JSON.stringify(updatedData, null, 2));

      res.json({ message: 'File uploaded successfully', students: normalizedStudents });
    })
    .on('error', (error) => {
      console.error('Error when processing the CSV file:', error);
      res.status(500).json({ message: 'Error processing the file', error });
    });
};



const getStudent = (req, res) => {
    if (fs.existsSync(DATABASE_PATH)) {
        const data = fs.readFileSync(DATABASE_PATH, 'utf8');
        res.json(JSON.parse(data));
    } else {
        res.status(404).json({ message: 'No data found' })
    }
};



const saveStudent = (req, res) => {
  const data = req.body;

  if (!data || !Array.isArray(data.students) || typeof data.exercises !== 'object') {
    return res.status(400).json({ message: 'Invalid data format' });
  }

  try {
    let existingData = {};
    try {
      existingData = JSON.parse(fs.readFileSync(DATABASE_PATH, 'utf8'));
    } catch (error) {
      console.warn('No existing data found, creating a new file.');
    }

    
    const updatedData = {
      ...existingData,
      students: data.students, 
       weightingOfExercice: {
        ...existingData.weightingOfExercice, 
        ...data.exercises, 
      },
     
    };

    fs.writeFileSync(DATABASE_PATH, JSON.stringify(updatedData, null, 2));
    res.json({ message: 'Data successfully saved' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Error saving data' });
  }
};


const addTask = (req, res) => {
  try {
    const { tasks, weightingOfExercice } = req.body;

    
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ message: 'A valid list of tasks is required' });
    }

    if (!weightingOfExercice || typeof weightingOfExercice !== 'object') {
      return res.status(400).json({ message: 'A valid weighting object is required' });
    }
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

    data.weightingOfExercice = { ...data.weightingOfExercice, ...weightingOfExercice };

    data.students = data.students.map(student => {
      if (!student.scores) {
        student.scores = {};
      }
      tasks.forEach(task => {
        if (!(task in student.scores)) {
          student.scores[task] = 0; 
        }
      });

      student.total = Object.values(student.scores).reduce((sum, score) => sum + score, 0);

      return student;
    });

    fs.writeFileSync(DATABASE_PATH, JSON.stringify(data, null, 2));

    res.json({ message: 'Tasks and weightings added successfully', data });
  } catch (error) {
    console.error('Error in addTask:', error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};




const deleteTask = (req, res) => {
  try {
    const { task } = req.body;

    if (!task) {
      return res.status(400).json({ message: 'Task is required' });
    }

    if (fs.existsSync(DATABASE_PATH)) {
      const rawData = fs.readFileSync(DATABASE_PATH, 'utf8');
      const data = JSON.parse(rawData);

      if (data.weightingOfExercice && task in data.weightingOfExercice) {
        delete data.weightingOfExercice[task]; 
      }


      data.students = data.students.map(student => {
        if (student.scores && task in student.scores) {
          delete student.scores[task];
        }
        
        student.total = Object.values(student.scores || {}).reduce((sum, score) => sum + score, 0);
        return student;
      });

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



const updateTask = (req, res) => {
  try {
    const { oldTask, newTask } = req.body;

    if (!oldTask || !newTask) {
      return res.status(400).json({ message: 'Both oldTask and newTask are required' });
    }

    if (fs.existsSync(DATABASE_PATH)) {
      const rawData = fs.readFileSync(DATABASE_PATH, 'utf8');
      const data = JSON.parse(rawData);

      if (data.weightingOfExercice && oldTask in data.weightingOfExercice) {
        data.weightingOfExercice[newTask] = data.weightingOfExercice[oldTask];
        delete data.weightingOfExercice[oldTask];
      }
      
      data.students = data.students.map(student => {
        if (student.scores && oldTask in student.scores) {
          student.scores[newTask] = student.scores[oldTask];
          delete student.scores[oldTask];
        }
        
        student.total = Object.values(student.scores || {}).reduce((sum, score) => sum + score, 0);
        return student;
      });

     
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
