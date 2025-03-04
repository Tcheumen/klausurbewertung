const express = require('express');
const dataController = require('../controllers/dataController');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });


router.post('/upload', upload.single('file'), dataController.uploadCSV);
router.get('/', dataController.getStudent);
router.post('/', dataController.saveStudent);
router.post('/addTask', dataController.addTask);
router.put('/updateTask', dataController.updateTask);
router.delete('/deleteTask', dataController.deleteTask);

module.exports = router;
