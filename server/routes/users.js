const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const usersController = require('../controllers/users');

const existsOptions = {
  checkFalsy: true
};

router.get(
  '/users/:id',
  [
    param('id', 'Please provide a valid user id.').exists(existsOptions).isNumeric()
  ],
  usersController.getUser
);

router.get('/users', usersController.getUsers);

router.post(
  '/users',
  [
    body('divisionId', 'Please provide a valid division id.').exists(existsOptions).isNumeric(),
    body('email', 'Please provide a valid email address.').trim().isEmail().normalizeEmail(),
    body('firstName', 'Please provide a first name.').trim().exists(existsOptions),
    body('lastName', 'Please provide a last name.').trim().exists(existsOptions),
    body('phone', 'Please provide a phone number.').trim().exists(existsOptions).isLength({ min: 10, max: 10 }),
    body('titleId', 'Please provide a valid title id.').exists(existsOptions).isNumeric()
  ],
  usersController.addUser
);

router.patch(
  '/users/:id',
  [
    param('id', 'Please provide a valid user id.').exists(existsOptions).isNumeric(),
    body('divisionId', 'Please provide a valid division id.').optional().exists(existsOptions).isNumeric(),
    body('email', 'Please provide a valid email address.').optional().trim().isEmail().normalizeEmail(),
    body('firstName', 'Please provide a first name.').optional().trim().exists(existsOptions),
    body('lastName', 'Please provide a last name.').optional().trim().exists(existsOptions),
    body('phone', 'Please provide a phone number.').optional().trim().exists(existsOptions).isLength({ min: 10, max: 10 }),
    body('titleId', 'Please provide a valid title id.').optional().exists(existsOptions).isNumeric()
  ],
  usersController.editUser
);

router.delete(
  '/users/:id',
  [
    param('id', 'Please provide a valid user id.').exists(existsOptions).isNumeric()
  ],
  usersController.removeUser
);

module.exports = router;