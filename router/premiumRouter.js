const express = require('express');
const premiumController = require('../controller/premiumController');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.get('/showLeaderBoard',authenticate,premiumController.showLeaderBoard);
router.get('/downloadedfiles',authenticate,premiumController.getDownloadedFiles);

module.exports = router;