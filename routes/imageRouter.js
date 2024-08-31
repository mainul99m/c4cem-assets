const express = require('express');
const imageController = require('./../controllers/imageController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/post').post(imageController.postImage).get(imageController.getImages);
router.route('/:key').get(imageController.getImage);


module.exports = router;