const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const divisionsController = require('../controllers/divisions');

const existsOptions = {
  checkFalsy: true
};

router.get(
  '/divisions/:id',
  [
    param('id', 'Please provide a valid division id.').exists(existsOptions).isNumeric()
  ],
  divisionsController.getDivision
);

router.get('/divisions', divisionsController.getDivisions);

router.post(
  '/divisions',
  [
    body('name', 'Please provide a name.').trim().exists(existsOptions)
  ],
  divisionsController.addDivision
);

router.patch(
  '/divisions/:id',
  [
    param('id', 'Please provide a valid division id.').exists(existsOptions).isNumeric(),
    body('name', 'Please provide a name.').trim().exists(existsOptions),
    body('active', 'Please provide a 1 or 0.').isNumeric()
  ],
  divisionsController.editDivision
);

module.exports = router;