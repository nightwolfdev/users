const express = require('express');
const server = express();
const bodyParser = require('body-parser');

const divisionRoutes = require('./routes/divisions');
const titleRoutes = require('./routes/titles');
const userRoutes = require('./routes/users');

// Allow CORS
server.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'DELETE, GET, PATCH, POST, PUT');
  response.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  next();
});

// Parse requests as JSON
server.use(bodyParser.json());

// Route setup
server.use(divisionRoutes);
server.use(titleRoutes);
server.use(userRoutes);

// Port setup
server.listen(9000);