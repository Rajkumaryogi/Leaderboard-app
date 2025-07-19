const express = require('express');
const router = express.Router();
const pointController = require('../controllers/pointController');

router.post('/:id/claim', pointController.claimPoints);
router.get('/:id/history', pointController.getPointHistory);

module.exports = router;