const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const titlesController = require('../controllers/titles');

const existsOptions = {
  checkFalsy: true
};

router.get(
  '/titles/:id',
  [
    param('id', 'Please provide a valid title id.').exists(existsOptions).isNumeric()
  ],
  titlesController.getTitle
);

router.get('/titles', titlesController.getTitles);

router.post(
  '/titles',
  [
    body('name', 'Please provide a name.').trim().exists(existsOptions)
  ],
  titlesController.addTitle
);

router.patch(
  '/titles/:id',
  [
    param('id', 'Please provide a valid title id.').exists(existsOptions).isNumeric(),
    body('name', 'Please provide a name.').trim().exists(existsOptions),
    body('active', 'Please provide a 1 or 0.').isNumeric()
  ],
  titlesController.editTitle
);

module.exports = router;