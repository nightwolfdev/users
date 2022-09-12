const db = require('../../database/sqlite');
const { validationResult } = require('express-validator');

const checkForInvalidFields = (body) => {
  const validFields = ['divisionId', 'email', 'firstName', 'lastName', 'phone', 'titleId'];

  return Object.keys(body).filter(field => !validFields.includes(field));
};

const handleError = (response, status, message) => {
  return response.status(status).json({ error: message });
};

const userEmailExists = (email) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT email FROM users WHERE email = ?';

    db.get(sql, email, (error, user) => {
      if (error) {
        reject(error.message);
      } else {
        resolve(user?.email);
      }
    });
  });
};

const userIdExists = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id FROM users WHERE id = ?';

    db.get(sql, id, (error, user) => {
      if (error) {
        reject(error.message);
      } else {
        resolve(user?.id);
      }
    });
  });
};

exports.getUser = (request, response, next) => {
  const sql = 'SELECT * FROM users WHERE id = ?';
  const userId = request.params.id;
  const validationErrors = validationResult(request);
  const validationErrorMsg = validationErrors.array().map(error => error.msg).join(' ');

  if (!validationErrors.isEmpty()) {
    return handleError(response, 422, validationErrorMsg);
  }

  db.get(sql, userId, (error, user) => {
    if (error) {
      return handleError(response, 500, error.message);
    }

    if (!user) {
      return handleError(response, 404, `User ID ${userId} does not exist.`);
    }

    response.status(200).json(user);
  });
};

exports.getUsers = (request, response, next) => {
  const sql = 'SELECT * FROM users';

  db.all(sql, (error, users) => {
    if (error) {
      return handleError(response, 500, error.message);
    }

    response.status(200).json(users);
  });
};

exports.addUser = (request, response, next) => {
  const { divisionId, email, firstName, lastName, phone, titleId } = request.body;
  const user = { divisionId, email, firstName, lastName, phone, titleId };
  const sql = 'INSERT INTO users (divisionId, email, firstName, lastName, phone, titleId) VALUES (?, ?, ?, ?, ?, ?)';
  const params = [divisionId, email, firstName, lastName, phone, titleId];
  const validationErrors = validationResult(request);
  const validationErrorMsg = validationErrors.array().map(error => error.msg).join(' ');
  const invalidFields = checkForInvalidFields(request.body);

  if (!validationErrors.isEmpty()) {
    return handleError(response, 422, validationErrorMsg);
  }

  if (invalidFields.length > 0) {
    return handleError(response, 400, `Invalid properties: ${invalidFields.join(',')}`);
  }

  userEmailExists(email)
    .then(email => {
      if (email) {
        return handleError(response, 422, `${email} already exists.`);
      }

      db.run(sql, params, function(error) {
        if (error) {
          return handleError(response, 500, error.message);
        }
    
        response.status(201).json({ id: this.lastID, ...user });
      });
    })
    .catch(error => {
      return handleError(response, 500, error.message);
    });
};

exports.editUser = (request, response, next) => {
  const userId = request.params.id;
  const { divisionId, email, firstName, lastName, phone, titleId } = request.body;
  const user = { divisionId, email, firstName, lastName, phone, titleId };
  const sql = `
    UPDATE users
    SET
      divisionId = COALESCE(?, divisionId),
      email = COALESCE(?, email),
      firstName = COALESCE(?, firstName),
      lastName = COALESCE(?, lastName),
      phone = COALESCE(?, phone),
      titleId = COALESCE(?, titleId)
    WHERE id = ?
  `;
  const params = [divisionId, email, firstName, lastName, phone, titleId, userId];
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

  userIdExists(userId)
    .then(id => {
      if (id) {
        db.run(sql, params, error => {
          if (error) {
            return handleError(response, 500, error.message);
          }

          response.status(200).json(user);
        });
      } else {
        return handleError(response, 404, `User ID ${userId} does not exist.`);
      }
    })
    .catch(error => {
      return handleError(response, 500, error.message);
    });
};

exports.removeUser = (request, response, next) => {
  const userId = request.params.id;
  const sql = 'DELETE FROM users WHERE id = ?';
  const params = [userId];
  const validationErrors = validationResult(request);
  const validationErrorMsg = validationErrors.array().map(error => error.msg).join(' ');

  if (!validationErrors.isEmpty()) {
    return handleError(response, 422, validationErrorMsg);
  }

  userIdExists(userId)
    .then(id => {
      if (id) {
        db.run(sql, params, error => {
          if (error) {
            return handleError(response, 500, error.message);
          }

          response.status(200).json({ id: userId });
        });
      } else {
        return handleError(response, 404, `User ID ${userId} does not exist.`);
      }
    })
    .catch(error => {
      return handleError(response, 500, error.message);
    });
};