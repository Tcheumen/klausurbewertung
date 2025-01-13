
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');


const dataController = require('./controllers/dataController');
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
app.get('/api/data', dataController.getData);
app.post('/api/data', dataController.saveData);
app.get('/api/export/csv', dataController.exportCSV);


app.post('/api/export/excel', exportController.generateExcel);
app.post('/api/export/pdf', exportController.generatePDF);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
});