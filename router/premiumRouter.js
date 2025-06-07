const express = require('express');
const premiumController = require('../controller/premiumController');
const router = express.Router();

router.get('/showLeaderBoard',premiumController.showLeaderBoard);

module.exports = router;