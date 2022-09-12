const db = require('../../database/sqlite');
const { validationResult } = require('express-validator');

const checkForInvalidFields = (body) => {
  const validFields = ['active', 'name'];

  return Object.keys(body).filter(field => !validFields.includes(field));
};

const divisionIdExists = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id FROM divisions WHERE id = ?';

    db.get(sql, id, (error, division) => {
      if (error) {
        reject(error.message);
      } else {
        resolve(division?.id);
      }
    });
  });
}

const handleError = (response, status, message) => {
  return response.status(status).json({ error: message });
};

exports.getDivision = (request, response, next) => {
  const sql = 'SELECT * FROM divisions WHERE id = ?';
  const divisionId = request.params.id;
  const validationErrors = validationResult(request);
  const validationErrorMsg = validationErrors.array().map(error => error.msg).join(' ');

  if (!validationErrors.isEmpty()) {
    return handleError(response, 422, validationErrorMsg);
  }

  db.get(sql, divisionId, (error, division) => {
    if (error) {
      return handleError(response, 500, error.message);
    }

    if (!division) {
      return handleError(response, 404, `Division ID ${divisionId} does not exist.`);
    }

    response.status(200).json(division);
  });
};

exports.getDivisions = (request, response, next) => {
  const sql = 'SELECT * FROM divisions';

  db.all(sql, (error, divisions) => {
    if (error) {
      return handleError(response, 500, error.message);
    }

    response.status(200).json(divisions);
  });
};

exports.addDivision = (request, response, next) => {
  const { name } = request.body;
  const division = { active: 1, name };
  const sql = 'INSERT INTO divisions (name) VALUES (?)';
  const params = [name];
  const validationErrors = validationResult(request);
  const validationErrorMsg = validationErrors.array().map(error => error.msg).join(' ');
  const invalidFields = checkForInvalidFields(request.body);

  if (!validationErrors.isEmpty()) {
    return handleError(response, 422, validationErrorMsg);
  }

  if (invalidFields.length > 0) {
    return handleError(response, 400, `Invalid properties: ${invalidFields.join(',')}`);
  }

  db.run(sql, params, function(error) {
    if (error) {
      return handleError(response, 500, error.message);
    }

    response.status(201).json({ id: this.lastID, ...division });
  });
};

exports.editDivision = (request, response, next) => {
  const divisionId = request.params.id;
  const { active, name } = request.body;
  const division = { active, name };
  const sql = `
    UPDATE divisions
    SET
      name = COALESCE(?, name),
      active = COALESCE(?, active)
    WHERE id = ?
  `;
  const params = [name, active, divisionId];
  const validationErrors = validationResult(request);
  const validationErrorMsg = validationErrors.array().map(error => error.msg).join(' ');
  const invalidFields = checkForInvalidFields(request.body);

  if (!validationErrors.isEmpty()) {
    return handleError(response, 422, validationErrorMsg);
  }

  if (Object.keys(request.body).length === 0) {
    return handleError(response, 400, 'Please provide at least one property to edit.');
  }

  if (invalidFields.length > 0)  {
    return handleError(response, 400, `Invalid properties: ${invalidFields.join(',')}`);
  }

  divisionIdExists(divisionId)
    .then(id => {
      if (id) {
        db.run(sql, params, error => {
          if (error) {
            return handleError(response, 500, error.message);
          }

          response.status(200).json(division);
        });
      } else {
        return handleError(response, 404, `Division ID ${divisionId} does not exist.`);
      }
    })
    .catch(error => {
      return handleError(response, 500, error.message);
    });
};