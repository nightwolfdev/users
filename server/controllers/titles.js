const db = require('../../database/sqlite');
const { validationResult } = require('express-validator');

const checkForInvalidFields = (body) => {
  const validFields = ['active', 'name'];

  return Object.keys(body).filter(field => !validFields.includes(field));
};

const handleError = (response, status, message) => {
  return response.status(status).json({ error: message });
};

const titleIdExists = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id FROM titles WHERE id = ?';

    db.get(sql, id, (error, title) => {
      if (error) {
        reject(error.message);
      } else {
        resolve(title?.id);
      }
    });
  });
}

exports.getTitle = (request, response, next) => {
  const sql = 'SELECT * FROM titles WHERE id = ?';
  const titleId = request.params.id;
  const validationErrors = validationResult(request);
  const validationErrorMsg = validationErrors.array().map(error => error.msg).join(' ');

  if (!validationErrors.isEmpty()) {
    return handleError(response, 422, validationErrorMsg);
  }

  db.get(sql, titleId, (error, title) => {
    if (error) {
      return handleError(response, 500, error.message);
    }

    if (!title) {
      return handleError(response, 404, `Title ID ${titleId} does not exist.`);
    }

    response.status(200).json(title);
  });
};

exports.getTitles = (request, response, next) => {
  const sql = 'SELECT * FROM titles';

  db.all(sql, (error, titles) => {
    if (error) {
      return handleError(response, 500, error.message);
    }

    response.status(200).json(titles);
  });
};

exports.addTitle = (request, response, next) => {
  const { name } = request.body;
  const title = { active: 1, name };
  const sql = 'INSERT INTO titles (name) VALUES (?)';
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

    response.status(201).json({ id: this.lastID, ...title });
  });
};

exports.editTitle = (request, response, next) => {
  const titleId = request.params.id;
  const { active, name } = request.body;
  const title = { active, name };
  const sql = `
    UPDATE titles
    SET
      name = COALESCE(?, name),
      active = COALESCE(?, active)
    WHERE id = ?
  `;
  const params = [name, active, titleId];
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

  titleIdExists(titleId)
    .then(id => {
      if (id) {
        db.run(sql, params, error => {
          if (error) {
            return handleError(response, 500, error.message);
          }

          response.status(200).json(title);
        });
      } else {
        return handleError(response, 404, `Title ID ${divisionId} does not exist.`);
      }
    })
    .catch(error => {
      return handleError(response, 500, error.message);
    });
};