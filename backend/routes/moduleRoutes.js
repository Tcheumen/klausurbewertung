const express = require('express');
const moduleController = require('../controllers/moduleController');


const router = express.Router();

router.post('/add-module', moduleController.addModuleInfo);
router.get('/get-module', moduleController.getModuleInfo);
router.put('/update-module', moduleController.updateModuleInfo);

module.exports = router;
