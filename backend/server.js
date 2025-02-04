/* This is a Node.js server setup using Express framework. Let me break down the code for you: */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');


const dataController = require('./controllers/dataController');
const thresholdController = require('./controllers/thresholdController');
const exportController = require('./controllers/exportController');



const app = express();
const PORT = 3000;


// Middleware

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('exports'));

const upload = multer({ dest: 'uploads/' });

// Routes API


app.post('/api/upload', upload.single('file'), dataController.uploadCSV);
app.get('/api/data', dataController.getStudent);
app.post('/api/data', dataController.saveStudent);
app.get('/api/export/csv', exportController.generateCSV);


app.post('/api/export/excel', exportController.generateExcel);
app.get('/api/export/excel-data', exportController.generateExcel);

app.get('/api/export/pdf', exportController.generatePDF);


//test excel
//app.get('/api/data/weighting', dataController.getWeightingOfExercice);
//app.post('/api/data/weighting', dataController.saveWeightingOfExercice);


app.post('/api/data/addTask', dataController.addTask);
app.put('/api/data/updateTask', dataController.updateTask);
app.delete('/api/data/deleteTask', dataController.deleteTask);

// route Threshold
app.post('/api/data/add-threshold', thresholdController.addThreshold);
app.put('/api/data/update-threshold', thresholdController.updateThreshold);
app.delete('/api/data/delete-threshold', thresholdController.deleteThreshold);
app.get('/api/data/get-threshold', thresholdController.getThresholds);
app.post('/api/data/save-threshold', thresholdController.saveAllThresholds);







app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
});