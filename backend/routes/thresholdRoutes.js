const express = require('express');
const thresholdController = require('../controllers/thresholdController');


const router = express.Router();

router.post('/add-threshold', thresholdController.addThreshold);
router.delete('/delete-threshold', thresholdController.deleteThreshold);
router.get('/get-threshold', thresholdController.getThresholds);
router.post('/save-threshold', thresholdController.saveAllThresholds);

module.exports = router;
