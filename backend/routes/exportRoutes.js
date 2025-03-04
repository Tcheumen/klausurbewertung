const express = require('express');
const exportController = require('../controllers/exportController');


const router = express.Router();

router.get('/excel', exportController.generateExcel);
router.get('/excel-data', exportController.generateExcel);

router.get('/csv', exportController.generateCSV);

router.get('/pdf', exportController.generatePDF);


module.exports = router;
