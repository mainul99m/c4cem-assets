const express = require('express');
const mapController = require('./../controllers/mapController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/post').post( mapController.postMap).get(mapController.getMaps);
router.route('/:key').get(mapController.getMap);


module.exports = router;