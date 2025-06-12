const express = require('express');
const premiumController = require('../controller/premiumController');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.get('/showLeaderBoard',premiumController.showLeaderBoard);
router.get('/downloadedfiles',authenticate,premiumController.getDownloadedFiles);

module.exports = router;